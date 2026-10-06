# Fase 2 — Arquitetura: material de estudo

> Material pessoal de estudo. A documentação oficial é [`docs/ARQUITETURA.md`](ARQUITETURA.md); este arquivo explica **como** chegar àquele entendimento e **por que** as coisas funcionam como funcionam.

---

## 1. Como a arquitetura foi identificada

A arquitetura não está escrita em nenhum lugar do projeto. Ela foi reconstruída combinando quatro fontes, sempre nesta ordem de confiança:

1. **O código** (fonte principal). A pergunta-guia foi "quem importa quem?". Uma busca por imports em `src/` mostra rapidamente:
   - `lib/cloudinary.ts` é importado por quase tudo, então é o centro da mídia;
   - `controllers/`, `models/` e `views/` só são usados a partir de `[locale]/page.tsx`, ou seja, o "MVC" é restrito à Home;
   - vários componentes não têm nenhum importador, o que indica código não utilizado.
2. **As convenções do Next.js.** Arquivos como `layout.tsx`, `page.tsx`, `route.ts` e `proxy.ts` não são importados por ninguém: o **framework** os encontra pelo nome e pela pasta. Para entender o fluxo de uma requisição, é preciso conhecer essas convenções, não só o grafo de imports.
3. **A execução** (Fase 1). O build mostrou quais páginas são estáticas e quais são dinâmicas. Os `curl` mostraram redirecionamentos, cookies e cabeçalhos. O navegador headless mostrou o que acontece com os vídeos. Várias afirmações da arquitetura só puderam ser confirmadas assim (ex.: `/fr` responde 200; a URL de vídeo fica gravada no HTML).
4. **O Graphify e a documentação existente**, como apoio para checar conexões e divergências, nunca como fonte final.

> **Lição:** em projetos Next.js, o grafo de imports conta só metade da história. A outra metade está nas **pastas** (que viram rotas) e nos **arquivos especiais** (que o framework chama sozinho).

---

## 2. Como `proxy.ts`, `routing.ts` e `i18n.ts` se relacionam

Pense em três funcionários com tarefas diferentes, que leem o mesmo crachá (`routing.ts`):

```
                 routing.ts
     (locales: en, pt, es · padrão: en)
        │              │              │
        ▼              ▼              ▼
   proxy.ts        i18n.ts      [locale]/layout.tsx
  "porteiro"     "bibliotecário"    "editor"
```

| Arquivo | Pergunta que responde | Quando roda |
|---|---|---|
| `proxy.ts` | "Para qual idioma eu mando esse visitante?" | A cada requisição de `/` ou `/pt…`, `/en…`, `/es…` (antes da página) |
| `i18n.ts` | "Quais textos eu carrego para esse idioma?" | Quando um Server Component pede traduções (no build, para as páginas SSG) |
| `[locale]/layout.tsx` | "Qual `lang` eu escrevo no HTML e que mensagens eu entrego aos componentes do navegador?" | Ao renderizar qualquer página |

**Por que existe a inconsistência com `/fr`:** cada um aplica uma regra diferente.

- O porteiro (`proxy.ts`) só fica na porta de `/pt`, `/en`, `/es` e `/` (por causa do `matcher`). Quem chega por `/fr` **entra por outra porta** sem ser parado.
- O bibliotecário (`i18n.ts`) olha o crachá: "`fr` não existe, vou entregar os livros em inglês".
- O editor (`layout.tsx`) escreve `lang="fr"` no HTML porque usa o valor da URL sem conferir.

Resultado: uma página em inglês que diz ser francesa. Nenhum dos três está "quebrado" sozinho. A inconsistência nasce da **divisão de responsabilidades sem uma validação única**.

**Exercício:** abra os três arquivos lado a lado e encontre a linha em que cada um decide o idioma:
- `proxy.ts:8`: o `matcher`;
- `i18n.ts:9-11`: a validação com fallback;
- `[locale]/layout.tsx:55` e `:63`: lê `params` e escreve `<html lang>`.

---

## 3. Como o Next decide entre Server e Client Components

A regra é simples, mas fácil de esquecer:

1. **Todo componente é Server Component por padrão.**
2. Um arquivo com `'use client'` na primeira linha vira uma **fronteira**: ele e **tudo o que ele importa** passam a ir para o navegador.
3. Um Server Component pode renderizar um Client Component (passando props serializáveis). O contrário (um Client Component importar um Server Component) transforma o importado em Client.

Exemplo real deste projeto:

```
[locale]/layout.tsx           (Server)
 ├─ Header                    (Client — 'use client')
 └─ ConditionalFooter         (Client — 'use client')
     └─ Footer                (sem 'use client', mas vira Client porque foi importado por um Client)
```

**Como saber se um componente *precisa* do cliente:** procure por recursos que só existem no navegador:

| Se o componente usa… | …precisa do cliente porque… |
|---|---|
| `useState`, `useEffect`, `useRef` | Estado e efeitos só existem depois que o React roda no navegador |
| `onClick`, `onSubmit`, `onMouseEnter` | Eventos de usuário acontecem no navegador |
| `usePathname`, `useRouter`, `useParams` (de `next/navigation`) | Hooks de navegação do lado do cliente |
| `IntersectionObserver`, `window`, `setInterval` | APIs do navegador |

Aplicando a tabela: `Header`, `ContactForm`, `StatsCounter`, `OptimizedVideo`, `TestimonialsCarousel`, `StatsCarousel`, `PhasesCarousel` e `MissionBadges` **precisam** do cliente. Já `PartnersCarousel`, `SocialMediaCard`, `LeadershipCard` e os carrosséis de cartões (`BenefitsCarousel` etc.) estão marcados como client, mas não usam nenhum desses recursos. Funcionam assim porque foram declarados assim, não por necessidade técnica.

**Hidratação em uma frase:** o servidor manda o HTML pronto (o visitante já vê a página) e, em seguida, o navegador baixa o JavaScript dos Client Components e "liga" os eventos e efeitos sobre esse HTML.

---

## 4. Como `generateStaticParams` influencia o build

```ts
// src/app/[locale]/layout.tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));   // [{locale:'en'}, {locale:'pt'}, {locale:'es'}]
}
```

O que essa função diz ao Next: "o segmento `[locale]` tem estes valores conhecidos, gere as páginas para eles **agora, no build**".

Como está no **layout** (acima de todas as páginas), vale para todas as rotas filhas:

```
6 páginas (home, about, missions, services, technologies, teacher-resources)
× 3 idiomas (en, pt, es)
= 18 arquivos HTML gerados no build
```

É isso que aparece na saída do `npm run build` com o símbolo **●** (SSG).

Dois detalhes importantes:

- **`setRequestLocale(locale)`** em cada página é o que permite ao next-intl funcionar sem ler cabeçalhos da requisição. Sem isso, a página precisaria ser dinâmica.
- **Valores fora da lista** (`/fr`) não são bloqueados: o Next os gera na primeira visita e guarda em cache. Isso porque o projeto não define `dynamicParams = false`. Bloquear não é o comportamento padrão.

---

## 5. Por que `NEXT_PUBLIC_USE_CLOUDINARY` precisa existir durante o build

Junte duas peças do ponto 4:

1. As páginas são geradas **no build**.
2. Durante essa geração, as páginas chamam `getVideoUrl('space.mp4')`.

Então a decisão "local ou Cloudinary" acontece **no build**, e o resultado é escrito no HTML:

```
Build sem a variável  →  HTML contém  /assets/space.mp4
Build com a variável  →  HTML contém  https://res.cloudinary.com/.../ideiaspace/space
```

Depois disso, o servidor só entrega o arquivo HTML pronto. Ninguém mais chama `getVideoUrl()`. Por isso:

- definir a variável na Vercel **depois** do deploy não muda nada até o **próximo build**;
- o build do CI (sem a variável) sempre gera caminhos locais.

Além disso, o prefixo `NEXT_PUBLIC_` faz o Next **trocar `process.env.NEXT_PUBLIC_X` pelo valor literal** no código que vai para o navegador. Essa é a razão de nunca colocar segredos em variáveis `NEXT_PUBLIC_*`: elas ficam visíveis para qualquer visitante.

> Para confirmar por conta própria: rode `npm run build` e procure `assets/ideiaforword.mp4` dentro de `.next/server/app/en.html`.

---

## 6. Como a mídia percorre o sistema

Siga um vídeo, `space.mp4`, do começo ao fim:

```
1. Alguém tem o arquivo original em public/assets/space.mp4 (fora do Git)
2. npm run compress:videos   → public/assets/compressed/space.mp4 (FFmpeg)
3. git add                   → o .mp4 vai para o Git LFS (.gitattributes)
4. npm run upload:cloudinary → Cloudinary: ideiaspace/space
5. src/lib/cloudinary.ts     → videoMap['space.mp4'] = 'ideiaspace/space'
6. about/page.tsx            → getVideoUrl('space.mp4')
7. Build                     → URL gravada no HTML (local OU Cloudinary)
8. Navegador                 → OptimizedVideo coloca a <source> quando o vídeo se aproxima da tela
```

**Onde a corrente se rompe no modo local:** no passo 6, o modo local devolve `/assets/space.mp4`, mas o arquivo está em `/assets/compressed/space.mp4` (passo 2). O caminho do passo 6 não "sabe" da pasta `compressed/`.

**Por que funciona no modo Cloudinary:** o passo 4 sobe o arquivo comprimido com o nome `ideiaspace/space`, que é exatamente o valor do `videoMap` no passo 5. Os nomes batem.

**Três "dicionários" que precisam concordar:**

| Dicionário | Exemplo |
|---|---|
| Nome usado nas páginas | `'Terraespaco.mp4'` (maiúsculas importam) |
| Chave no `videoMap`/`imageMap` | `'Terraespaco.mp4': 'ideiaspace/Terraespaco'` |
| `public_id` no Cloudinary (gerado pelo script) | `ideiaspace/Terraespaco` |

Se um deles divergir, a mídia some. Um exemplo de divergência é `lib/assets.ts`, que usa `ideiaspace/videos/...`, um esquema que não existe na CDN (e por isso o arquivo não é usado).

---

## 7. Como a Home se relaciona com controller/model/sections

```
[locale]/page.tsx
   │  t = await getTranslations()          ← todas as traduções do idioma
   ▼
HomeController.getPageContent(t)            ← controllers/
   │  monta textos + URLs de vídeo + links
   ▼
PageContent { hero, challenge, technologies, cta }   ← models/ (só a "forma" dos dados)
   │
   ├─ hero         → HeroSection          ← views/sections/
   ├─ challenge    → ChallengeSection
   ├─ technologies → TechnologiesSection
   └─ cta          → (ninguém usa)
```

O que observar ao estudar:

- O **model** não tem lógica; são só `interface`s TypeScript. Ele serve para o controller e as seções concordarem sobre o formato dos dados.
- O **controller** não acessa banco nem API. Ele só reorganiza traduções e acrescenta URLs. É uma "fábrica de props".
- Só **3 das 7 seções** passam pelo controller. As outras (`StatsCounter`, `IdeiaToSpaceSection`, `MissionsSection`, contato) recebem os textos diretamente em `page.tsx`. Por isso não se deve chamar o projeto de "MVC": é uma organização local da Home.
- O controller monta mais do que é exibido (botões do Hero, bloco `cta`). Comparar `content.model.ts` com `HeroSection.tsx` mostra exatamente quais campos são ignorados.

---

## 8. Como as APIs se encaixam na arquitetura

As duas APIs são **Route Handlers**: arquivos `route.ts` dentro de `src/app/api/`. Eles:

- **não** passam pelo `proxy.ts` (o `matcher` não inclui `/api`);
- **não** têm idioma;
- são as **únicas partes dinâmicas** do servidor (ƒ no build);
- mantêm as **credenciais no servidor**: o navegador nunca vê `RESEND_API_KEY` nem as senhas do Space-Track.

O padrão comum às duas é **"degradar sem quebrar"**:

| API | Com credenciais | Sem credenciais / com erro |
|---|---|---|
| `/api/contact` | Envia e-mail pelo Resend | Devolve um link `mailto:` para o navegador abrir |
| `/api/satellites` | Busca TLEs no Space-Track/N2YO, com cache | Devolve TLEs de exemplo (status 200) |

Esse padrão explica por que o CI consegue rodar `build` e testes **sem nenhum segredo**.

A diferença entre elas está em **quem chama**:

- `/api/contact` é chamada pelo próprio site (`ContactForm`).
- `/api/satellites` não é chamada por nada neste repositório. É um serviço exposto por HTTP, e o consumidor está fora daqui. As pistas no repositório são as dependências `satellite.js`/`react-globe.gl`/`three` (declaradas e não usadas) e o link do menu para `tleideiaspaceview.vercel.app`. Pistas não são confirmação.

---

## 9. Roteiro de leitura dos arquivos

Leia nesta ordem. Cada etapa depende da anterior.

| # | Arquivo(s) | O que observar |
|---|---|---|
| 1 | `package.json`, `next.config.ts` | Scripts disponíveis; plugin do next-intl apontando para `i18n.ts`; `reactCompiler`; `images.remotePatterns` do Cloudinary; cabeçalhos HTTP |
| 2 | `src/routing.ts` | Os três idiomas e o padrão `en` |
| 3 | `src/proxy.ts` | O `matcher`, com os idiomas escritos à mão |
| 4 | `src/i18n.ts` | Validação do locale e `import` dinâmico do JSON |
| 5 | `messages/pt.json` (só a estrutura) | Os namespaces (`nav`, `hero`, `about`, `services`…) e as chaves com `<br/>` |
| 6 | `src/app/layout.tsx` → `src/app/[locale]/layout.tsx` | Por que o raiz só devolve `children`; `generateStaticParams`; `setRequestLocale`; `NextIntlClientProvider`; `metadata` |
| 7 | `src/components/Header.tsx` | `'use client'`, estado do menu, troca de idioma com `pathname.replace` |
| 8 | `src/components/ConditionalFooter.tsx` → `Footer.tsx` | Fronteira de cliente "herdada" pelo `Footer` |
| 9 | `src/models/content.model.ts` → `src/controllers/home.controller.ts` → `src/app/[locale]/page.tsx` | O fluxo da Home |
| 10 | `src/views/sections/*.tsx` | Quais seções são Server e quais são Client; campos ignorados no `HeroSection` |
| 11 | `src/lib/cloudinary.ts` | `videoMap`, `imageMap`, o `if (USE_CLOUDINARY …)` e o caminho `/assets/${filename}` |
| 12 | `src/components/OptimizedVideo.tsx` | Lazy-load com `IntersectionObserver` e o atributo `priority` |
| 13 | `scripts/compress-videos.js` → `scripts/upload-to-cloudinary.js` → `.gitattributes` | De onde vêm os arquivos e os `public_id` |
| 14 | Uma página interna completa: `src/app/[locale]/services/page.tsx` | Dados montados no servidor e passados como props para carrosséis client |
| 15 | `src/components/ContactForm.tsx` → `src/app/api/contact/route.ts` | Os dois lados do contrato do formulário |
| 16 | `src/app/api/satellites/route.ts` (com `API_DOCUMENTATION.md` aberto) | Cache em módulo, validação de TLE, fallbacks |
| 17 | `vitest.config.ts` → `src/lib/__tests__/cloudinary.test.ts` → `src/app/api/__tests__/satellites.test.ts` | Como os testes isolam variáveis de ambiente e módulos (`vi.stubEnv`, `vi.resetModules`) |
| 18 | `docs/ARQUITETURA.md` (seção 14) | Rever os limites conhecidos com tudo isso em mente |

---

## 10. Perguntas para testar o entendimento

1. Se eu acessar `/es/missions`, quais arquivos executam e em que ordem? O rodapé aparece?
2. Por que `/api/satellites` não recebe o cookie `NEXT_LOCALE` nem é redirecionada?
3. Se eu remover `'use client'` de `StatsCounter.tsx`, o que deixaria de funcionar e por quê?
4. Eu defini `NEXT_PUBLIC_USE_CLOUDINARY=true` na Vercel ontem e os vídeos continuam quebrados. O que provavelmente aconteceu?
5. Quero adicionar o idioma francês. Quais arquivos precisam mudar? (Dica: são pelo menos quatro, e um deles tem os idiomas escritos à mão.)
6. Por que o texto "Watch video" aparece no HTML da Home se nenhum botão o exibe?
7. Um vídeo novo, `lancamento.mp4`, foi comprimido e enviado ao Cloudinary, mas não aparece no site com o Cloudinary ligado. O que está faltando?

<details>
<summary>Respostas</summary>

1. `proxy.ts` → `[locale]/layout.tsx` → `missions/layout.tsx` → `missions/page.tsx` → `OptimizedVideo`, `ScrollIndicator`, `MissionBadges`. Em produção, o HTML já está pronto desde o build. O rodapé **não** aparece (`ConditionalFooter` esconde em `/missions`).
2. Porque o `matcher` do `proxy.ts` só inclui `/` e `/(pt|en|es)/...`.
3. Ele passaria a ser Server Component, e `useState`/`useEffect` não podem ser usados em Server Components: o Next acusa erro na compilação. Mesmo que não acusasse, o `IntersectionObserver` e o `setInterval` só existem no navegador, e o contador nunca animaria.
4. Não houve um build novo depois de definir a variável (ou ela não estava disponível na etapa de build).
5. `routing.ts` (lista de locales), `proxy.ts` (`matcher`), `messages/fr.json` (novo arquivo, com as mesmas chaves) e `Header.tsx` (lista `languages` do seletor). Também o teste de paridade, se quiser cobrir o novo idioma.
6. Porque o `NextIntlClientProvider` recebe **todas** as mensagens do idioma, que vão serializadas no HTML.
7. A entrada `'lancamento.mp4': 'ideiaspace/lancamento'` no `videoMap` de `src/lib/cloudinary.ts`, e uma página que chame `getVideoUrl('lancamento.mp4')`, seguidas de um novo build.

</details>
