# Fase 1 — Validação prática

> **Commit validado:** `ee19572` (branch `documentacao`; o código da aplicação é o mesmo do commit `a71fa4c` analisado na auditoria) · **Data:** 06/10/2026 · **Máquina:** Windows 11, Node 22.11.0, npm 11.6.1
>
> Material de estudo. Registra o que aconteceu de fato ao executar o projeto localmente. Nenhum código da aplicação foi alterado nesta fase.

Legenda usada nas tabelas:

| Marcador | Significado |
|---|---|
| ✅ | Confirmado na execução (ou, quando indicado, por leitura do código/arquivos) |
| ⚠️ | Parcialmente confirmado, ou o resultado foi diferente do que a auditoria esperava |
| ❓ | Continua sem confirmação — depende de algo fora do repositório |

---

## Objetivo

A [`AUDITORIA_INICIAL.md`](../AUDITORIA_INICIAL.md) foi feita apenas lendo o código. Vários pontos ficaram marcados como ❓ porque só podiam ser confirmados **rodando** o projeto. Esta fase tentou:

1. instalar, verificar, testar e compilar o projeto exatamente como o CI faz;
2. subir o site localmente e conferir rotas, idiomas, navegação, formulário, imagens e vídeos;
3. testar o achado **A1** (vídeos quebrados sem Cloudinary) nos dois modos;
4. exercitar as duas APIs pelos caminhos que não precisam de credenciais;
5. reclassificar os itens A1–A18 e D1–D14 da auditoria.

Nada foi corrigido. Falhas foram registradas como ocorreram.

---

## Preparação

| Item | Valor usado | Observação |
|---|---|---|
| Sistema | Windows 11 Home | Comandos executados via Git Bash e PowerShell |
| Node.js | **22.11.0** | O `.nvmrc` pede `20`. Não há `nvm` instalado na máquina, então foi usada a versão disponível. O Next 16 exige `>=20.9.0` (campo `engines` no `package-lock.json`), então 22 é compatível. |
| npm | 11.6.1 | |
| Git LFS | 3.6.0 | Os 13 `.mp4` de `public/assets/compressed/` já estavam baixados (arquivos reais, não ponteiros). |
| Variáveis de ambiente | **nenhuma** | Não existe `.env*` no repositório. Nenhuma credencial foi usada. |
| Modo Cloudinary | `NEXT_PUBLIC_USE_CLOUDINARY=true` passado **só na linha de comando** de um dos servidores de desenvolvimento | Sem credenciais: o código já usa o *cloud name* público `dgyueliom` como padrão. Só foram feitos GETs públicos à CDN. Nenhum `.env` foi criado. |
| Navegador | Google Chrome instalado na máquina, controlado em modo headless por `puppeteer-core` | O `puppeteer-core` foi instalado numa pasta **temporária fora do projeto**. `package.json` e `package-lock.json` não foram tocados. |

---

## Comandos executados

| # | Comando | O que verifica | Resultado |
|---|---|---|---|
| 1 | `npm ci` | Instala exatamente as versões do `package-lock.json` (instalação reprodutível, igual ao CI). | ✅ 726 pacotes em ~222 s |
| 2 | `npm run lint` | ESLint com as regras do Next (Core Web Vitals + TypeScript). | ✅ 0 erros, 24 warnings |
| 3 | `npm run typecheck` | `tsc --noEmit`: verifica os tipos de todo o projeto sem gerar arquivos. | ✅ sem erros (~7 s) |
| 4 | `npm run test:run` | Vitest executa todos os testes uma vez. | ✅ 7 arquivos, 31 testes, 31 aprovados |
| 5 | `npm run test:ci` | Mesmos testes com medição de cobertura (v8) e limites mínimos. | ✅ 31/31, cobertura acima dos limites |
| 6 | `npm run test:fuzz` | Só os arquivos `*.fuzz.test.ts` (testes de propriedade com fast-check). | ✅ 2 arquivos, 5 testes |
| 7 | `npm run build` | Build de produção (`next build`) **sem nenhuma variável de ambiente**, como no CI. | ✅ em ~31 s |
| 8 | `npm run dev -- --port 3100` | Servidor de desenvolvimento no modo padrão (sem Cloudinary). | ✅ pronto em 3,4 s |
| 9 | `curl` em rotas, APIs e assets | Status HTTP, redirecionamentos, cabeçalhos e corpo das respostas. | ver Resultados |
| 10 | Script headless (Chrome) | Lazy-load real dos vídeos, imagens quebradas, erros de rede/console, troca de idioma, menu mobile, envio do formulário, capturas desktop (1440×900) e mobile (375×812). | ver Resultados |
| 11 | `NEXT_PUBLIC_USE_CLOUDINARY=true npm run dev -- --port 3101` | Mesmo site com mídia vinda do Cloudinary. | ✅ |
| 12 | `curl` na CDN pública `res.cloudinary.com/dgyueliom` | Se cada `public_id` mapeado no código existe de fato. | ver Resultados |
| 13 | `npm run start -- --port 3102` | Servidor de produção a partir do build do passo 7. | ✅ pronto em ~1 s |
| 14 | `npm audit` | Vulnerabilidades conhecidas nas dependências (o CI roda a variante `--omit=dev`). | ⚠️ 39 no total |

Todos os servidores foram encerrados ao final.

---

## Resultados

### 1. Instalação (`npm ci`)

- **Sucesso**, com Node 22.11.0.
- Warnings de pacotes **depreciados** (dependências indiretas): `whatwg-encoding@3.1.1`, `q@1.5.1`, `glob@10.5.0`.
- Nenhum warning de incompatibilidade de `engines`.
- O npm reportou **39 vulnerabilidades** (1 baixa, 10 moderadas, 24 altas, 4 críticas). Ver o item 8 abaixo.

### 2. Qualidade estática

**Lint — 0 erros, 24 warnings.** Agrupados por tipo:

| Regra | Qtde | Onde |
|---|---|---|
| `@next/next/no-img-element` (uso de `<img>` em vez de `next/image`) | 11 | `BenefitsCarousel` (2), `HistoryCarousel` (2), `MVVCarousel` (2), `InfoCard`, `PartnersCarousel`, `ResourceCard`, `StatsCounter`, `IdeiaToSpaceSection` |
| `@typescript-eslint/no-unused-vars` | 9 | `[locale]/page.tsx` (`LeadershipCard`, `getVideoUrl`), `services/page.tsx` (`Link`), `teacher-resources/page.tsx` (`t`), `technologies/page.tsx` (`getVideoUrl`), `StatsCarousel` (`locale`), `HeroSection` (`Link`, `locale`) |
| `@typescript-eslint/no-explicit-any` | 3 | `home.controller.ts`, `i18n.ts`, `TechnologiesSection.tsx` |
| `react-hooks/exhaustive-deps` | 1 | `StatsCarousel.tsx:35` |

Os warnings de lint **confirmam automaticamente** vários achados da auditoria (imports não usados, `t` não usado em `teacher-resources`, `<img>` sem otimização).

**Typecheck — sem erros.**

### 3. Testes

| Arquivo | Testes | Resultado |
|---|---|---|
| `controllers/__tests__/home.controller.test.ts` | 2 | ✅ |
| `lib/__tests__/cloudinary.test.ts` | 7 | ✅ |
| `__tests__/messages-parity.test.ts` | 4 | ✅ |
| `app/api/__tests__/contact.test.ts` | 6 | ✅ |
| `lib/__tests__/cloudinary.fuzz.test.ts` | 3 | ✅ |
| `app/api/__tests__/contact.fuzz.test.ts` | 2 | ✅ |
| `app/api/__tests__/satellites.test.ts` | 7 | ✅ |
| **Total** | **31** | **31 aprovados, 0 falhando** |

`test:fuzz` executa só os 2 arquivos de fuzz (5 testes), todos aprovados, com o número padrão de iterações (200 e 300; o CI noturno usa `FUZZ_RUNS=3000`, que não foi executado aqui).

**Cobertura (`test:ci`):**

| Escopo | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| **Total** | **69,91%** | **78,21%** | **78,57%** | **69,91%** |
| `app/api/contact/route.ts` | 94,84% | 95,65% | 100% | 94,84% |
| `app/api/satellites/route.ts` | 74,56% | 62,79% | 66,66% | 74,56% |
| `controllers/home.controller.ts` | 100% | 100% | 100% | 100% |
| `lib/cloudinary.ts` | 96,87% | 90,32% | 100% | 96,87% |
| `lib/assets.ts` | 0% | 0% | 0% | 0% |
| `lib/wordpress.ts` | 0% | 0% | 0% | 0% |
| `models/content.model.ts` | 0% | — | — | — |

Limites mínimos configurados: 55 / 60 / 55 / 55 → **atendidos**. Os 0% de `assets.ts` e `wordpress.ts` reforçam que são código morto, e puxam a média de `lib/` para 51%.

**Comportamentos a notar (não são falhas):**

- Os testes imprimem logs reais da rota (ex.: `RESEND_API_KEY not configured. Using mailto fallback.`, `Error sending email: Error: resend down`). O erro em `stderr` é **esperado**: vem do teste que simula o Resend fora do ar.
- No Windows, o ambiente `jsdom` foi a etapa mais lenta (~92 s somados entre os *workers* na primeira execução, ~15 s na segunda, por causa do cache).

### 4. Build

**Sucesso** (Next.js 16.0.8 com **Turbopack**, que é o bundler padrão do Next 16).

Rotas produzidas:

```
Route (app)
┌ ○ /_not-found
├ ● /[locale]                 → /en, /pt, /es
├ ● /[locale]/about           → /en/about, /pt/about, /es/about
├ ● /[locale]/missions        → …
├ ● /[locale]/services        → …
├ ● /[locale]/teacher-resources → …
├ ● /[locale]/technologies    → …
├ ƒ /api/contact
├ ƒ /api/satellites
└ ○ /icon.png

ƒ Proxy (Middleware)

○ (Static)  ● (SSG — prerenderizada com generateStaticParams)  ƒ (Dynamic)
```

- **18 páginas SSG** (6 rotas × 3 idiomas) foram geradas como HTML estático no build, o que confirma que `generateStaticParams` + `setRequestLocale` funcionam como a auditoria descreveu.
- As **duas APIs são dinâmicas** (executadas a cada requisição).
- O `proxy.ts` é reconhecido como middleware.
- Mensagem repetida em todo o build: `[baseline-browser-mapping] The data in this module is over two months old` (dependência de dev desatualizada; só aviso).
- **Descoberta importante:** o HTML gerado (`.next/server/app/en.html`) já contém `/assets/ideiaforword.mp4` escrito dentro dele. Variáveis `NEXT_PUBLIC_*` são **avaliadas no momento do build**. Para o site usar o Cloudinary em produção, `NEXT_PUBLIC_USE_CLOUDINARY=true` precisa estar definida **durante o build** na Vercel, não só em tempo de execução.

### 5. Execução local (modo padrão, sem variáveis)

**Redirecionamento de `/`** (detecção de idioma do next-intl):

| Requisição | Resultado |
|---|---|
| `GET /` sem `Accept-Language` | `307 → /en` + cookie `NEXT_LOCALE=en` |
| `Accept-Language: pt-BR` | `307 → /pt` |
| `Accept-Language: es-ES` | `307 → /es` |
| `Accept-Language: fr-FR` (não suportado) | `307 → /en` |
| Cookie `NEXT_LOCALE=es` | `307 → /es` |

**Páginas:**

| Rota | Status |
|---|---|
| `/en`, `/pt`, `/es` e as 5 páginas internas nos 3 idiomas (18 URLs) | todas **200** |
| `/pt/terms`, `/pt/privacy` (links do rodapé) | **404** |
| `/pt/naoexiste` | **404** |
| `/fr`, `/fr/about`, `/de`, `/edusat`, `/orbital`, `/methodology` | **200** ⚠️ (ver abaixo) |

⚠️ **Resultado inesperado:** qualquer primeiro segmento da URL é aceito como "idioma". `/fr` e `/edusat` renderizam a **Home em inglês** com `<html lang="fr">` / `<html lang="edusat">`, e os links internos apontam para `/en/...`. Isso acontece porque:

1. o `matcher` do `proxy.ts` só intercepta `/`, `/pt/...`, `/en/...` e `/es/...`, então `/fr` não passa pelo middleware;
2. o segmento `[locale]` aceita qualquer valor, e o layout **não** chama `notFound()` para idiomas inválidos;
3. `src/i18n.ts` cai para `en` quando o idioma é inválido, mas o layout usa o valor bruto no atributo `lang`.

No servidor de produção (`npm start`), essas páginas também respondem 200 e ficam **cacheadas** (`x-nextjs-cache: HIT`, `Cache-Control: s-maxage=31536000`).

**Navegação e interação (Chrome headless):**

| Verificação | Resultado |
|---|---|
| Menu desktop (`/pt`) | ✅ Início, Sobre Nós, Missões, Desafio (`/pt/services`), Recursos (`/pt/technologies`), Programação e Nossos Satélites (externos), seletor de idioma, Contato (`/pt#contact`) |
| Troca de idioma | ✅ Em `/pt/about`, abrir o seletor e escolher "Español" leva para `/es/about`, `<html lang="es">`, título em espanhol |
| Menu mobile (375 px) | ✅ Fechado mostra só o logo; o botão "Menu" abre os 8 itens com os mesmos destinos do desktop |
| `/teacher-resources` | ✅ Não aparece em nenhum menu; em `/en/teacher-resources` o texto é "Recursos para Professores / Em breve…" (português fixo) |
| Formulário de contato (em `/en`) | ✅ `POST /api/contact` → 200 com `useMailto`; o formulário mostra **"Mensagem recebida! Abrindo cliente de email..."** em **português** numa página em inglês |
| Imagens | ✅ 45 URLs de imagem distintas nas 6 páginas, todas **200**; nenhuma `<img>` quebrada no navegador |
| Vídeos | ❌ todos falham (ver a seção 6) |
| Responsivo | ✅ Sem rolagem horizontal em 375 px nem em 1440 px (Home e Desafio). Capturas de tela conferidas manualmente |
| Cabeçalhos | ✅ `X-DNS-Prefetch-Control: on`, `Content-Security-Policy: frame-ancestors *;`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`; `/assets/*` com `Cache-Control: public, max-age=31536000, immutable` |

Observações visuais das capturas:

- O hero da Home fica **totalmente preto** (sem o vídeo), só com o título.
- O hero de `/pt/services` mostra só o título "Desafio Espacial", sem parágrafo, porque a tradução `services.spaceChallenge.description` está vazia em `pt` e `en`.
- No Windows, o seletor de idioma mostra **"BR"** em vez da bandeira 🇧🇷: o Windows não desenha emojis de bandeira. Depende do sistema operacional de quem visita.
- A Home tem **dois `<h1>`** ("Welcome to Ideia Space" e "Educational resources", este vindo da `TechnologiesSection`).

### 6. Vídeos e Cloudinary — achado A1

**Sem `NEXT_PUBLIC_USE_CLOUDINARY`:**

| URL gerada pelo código | Status | Arquivo real | Status |
|---|---|---|---|
| `/assets/ideiaforword.mp4` | **404** | `/assets/compressed/ideiaforword.mp4` | 206 |
| `/assets/desafioespacial.mp4` | **404** | `/assets/compressed/desafioespacial.mp4` | 206 |
| `/assets/emblema.mp4` | **404** | `/assets/compressed/emblema.mp4` | 206 |
| `/assets/space.mp4` | **404** | `/assets/compressed/space.mp4` | 206 |
| `/assets/terranoite.mp4` | **404** | `/assets/compressed/terranoite.mp4` | 206 |
| `/assets/historia1.mp4` / `2` / `3` | **404** | `/assets/compressed/historia{1,2,3}.mp4` | 206 |

No navegador, **todos os 11 elementos `<video>`** das 5 páginas que têm vídeo ficaram com `networkState = 3` (NETWORK_NO_SOURCE) e `readyState = 0`. Cada página com vídeo registrou `Failed to load resource: 404` no console. O mesmo acontece no servidor de produção (`/assets/ideiaforword.mp4` → 404).

(O código de status 206, *Partial Content*, é a resposta normal quando o navegador pede um trecho do vídeo: significa que o arquivo existe.)

**Com `NEXT_PUBLIC_USE_CLOUDINARY=true`:**

- As URLs passam a ser `https://res.cloudinary.com/dgyueliom/video/upload/q_auto:eco,f_auto/ideiaspace/<nome>`.
- No navegador, **os 11 elementos `<video>` carregaram** (`readyState = 4`, larguras de 480 a 1920 px), sem nenhum erro de rede ou de console em nenhuma das 6 páginas.

**Existência dos assets na CDN pública (`dgyueliom`):**

| Grupo | Resultado |
|---|---|
| 13 vídeos do `videoMap` (incluindo os 8 usados pelas páginas) | ✅ todos existem |
| `impactocard2`, `impactocard4` | ❌ 404, mas só são usados pelo `ImpactCarousel`, que não é renderizado |
| 31 imagens do `imageMap` | ✅ todas existem, inclusive `MissionProgrammingTool` |
| Esquema de `lib/assets.ts` (`ideiaspace/videos/space`, `ideiaspace/images/nebulus`) | ❌ 404, esse esquema de nomes não existe na CDN |

**Conclusão sobre A1:** confirmado. O problema ocorre **sempre que `NEXT_PUBLIC_USE_CLOUDINARY` não é exatamente `"true"` no momento do build** (ou do `next dev`). Afeta o desenvolvimento local, o build do CI e qualquer deploy sem essa variável. Com a variável definida, todos os vídeos usados funcionam.

### 7. APIs

**`/api/contact`** (sem `RESEND_API_KEY`):

| Entrada | Resposta |
|---|---|
| Campo faltando | `400 {"error":"Todos os campos são obrigatórios"}` |
| E-mail inválido | `400 {"error":"Email inválido"}` |
| Corpo que não é JSON | `400 {"error":"Todos os campos são obrigatórios"}` (JSON inválido é tratado como corpo vazio) |
| `name` numérico | `400 {"error":"Campo \"name\" inválido"}` |
| `name` com 201 caracteres | `400 {"error":"Campo \"name\" inválido"}` |
| Válido (com `<b>` e `&` no conteúdo) | `200` com `useMailto: true` e `mailto:admin@ideiaspace.com?subject=…&body=…` corretamente codificado |
| `GET /api/contact` | `405` (só `POST` existe) |

**`/api/satellites`** (sem `N2YO_API_KEY` e sem `SPACETRACK_*`):

| `groups` | Status | `X-Cache-Status` | `X-Data-Source` | Satélites devolvidos |
|---|---|---|---|---|
| (ausente) | 200 | FALLBACK | `fallback-no-key` | 3 (ISS, Tiangong, Hubble) |
| `ideiaspace` | 200 | FALLBACK | `fallback-no-credentials` | 3 (SARI-1, SARI-2, ANISC) |
| `stations` | 200 | FALLBACK | `fallback-no-key` | 3 |
| `starlink` | 200 | FALLBACK | `fallback-no-key` | 10 (o código configura 30 IDs) |
| `weather` | 200 | FALLBACK | `fallback-no-key` | 10 (o código configura 22 IDs) |
| `desconhecido` | 200 | FALLBACK | `fallback-no-key` | 3 (cai em `stations`) |

Nesse modo a rota **não faz nenhuma chamada externa**: devolve o fallback antes de qualquer `fetch`.

**Continuam dependentes de serviços externos:** envio real pelo Resend; consulta real ao Space-Track e à N2YO; os estados `MISS`, `HIT` e `STALE` com dados reais. Esses caminhos são cobertos apenas pelos testes automatizados, com `fetch` e `resend` simulados.

### 8. `npm audit`

| Escopo | Total | Crítica | Alta | Moderada | Baixa |
|---|---|---|---|---|---|
| Todas as dependências | 39 | 4 | 24 | 10 | 1 |
| Só produção (`--omit=dev`, igual ao CI) | 11 | 1 | 6 | 4 | 0 |

Em produção, a vulnerabilidade crítica é no próprio **`next`** (dependência direta, título *"Next Server Actions Source Code Exposure"*). As altas são em `lodash`, `lodash-es`, `nanoid`, `postcss`, `sharp` e `source-map-js` (indiretas). Isso **não foi corrigido** (fora do escopo). No CI esse job é apenas informativo (não bloqueia).

### 9. Deploy (somente pelo repositório)

Nada novo pôde ser confirmado além do que a auditoria já registrou a partir de `vercel.json` e `.github/workflows/deploy.yml`. Os painéis da Vercel e os *secrets* não foram acessados. A única informação nova relevante para deploy é a do item 4: **`NEXT_PUBLIC_USE_CLOUDINARY` precisa existir no ambiente de build**.

---

## Validação dos achados

### Itens A (comportamentos)

| Item | Resultado | Evidência |
|---|---|---|
| A1 — vídeos locais quebrados | ✅ | 8 URLs `/assets/*.mp4` → 404 (dev e produção); 11/11 `<video>` sem fonte no navegador; com Cloudinary, 11/11 carregam. Os caminhos ficam fixos no HTML do build. |
| A2 — `/api/satellites` e libs 3D sem uso | ✅ | Busca no código sem chamadas; build compila sem que esses pacotes sejam importados. Quem consome a API continua ❓. |
| A3 — HIT sempre informa `n2yo` | ⚠️ | Confirmado só pela leitura do código (`route.ts:251`). Não dá para exercitar o HIT do grupo `ideiaspace` sem credenciais do Space-Track. |
| A4 — cache em memória em serverless | ❓ | Depende do ambiente da Vercel. Localmente o cache funciona dentro do mesmo processo (há teste que confirma o HIT). |
| A5 — TLEs de fallback ilustrativos | ❓ | Continua sem confirmação. Novo detalhe: o fallback `starlink` tem 10 satélites (4 deles com IDs que **não** estão na lista configurada) e o `weather` tem 10 de 22. |
| A6 — `/terms`, `/privacy` e links `#` | ✅ | `/pt/terms` e `/pt/privacy` → 404; 2 links `href="#"` no HTML da Home (rodapé). |
| A7 — `/teacher-resources` órfã | ✅ | Responde 200 nos 3 idiomas; não aparece nos menus desktop nem mobile; texto em português fixo em `/en`; lint aponta `t` não usado. |
| A8 — cards de Recursos todos WIP | ⚠️ | 9 selos "Work in Progress" renderizados. **Diferente do esperado:** `/edusat`, `/orbital` e `/methodology` não dão 404; respondem 200 tratando o segmento como idioma (ver A15). |
| A9 — textos fora do i18n | ✅ | Em `/en`, o formulário mostra a resposta em português; `/en/technologies` mostra "Saiba Mais" 9×; metadados (`description`, `og:title`) em inglês em `/es`. |
| A10 — `dangerouslySetInnerHTML` | ✅ | Confirmado por leitura do código. Não foi testado com conteúdo malicioso (fora do escopo). |
| A11 — números de impacto inconsistentes | ❓ | Qual é o número oficial depende do time. |
| A12 — dois esquemas de `public_id` | ✅ | `ideiaspace/<nome>` existe na CDN; `ideiaspace/videos/<nome>` e `ideiaspace/images/<nome>` (de `lib/assets.ts`) dão 404. |
| A13 — *cloud name* fixo `dgyueliom` | ✅ | Usado nas URLs geradas quando nenhuma variável define outro; os assets existem nessa conta. |
| A14 — campos montados e não exibidos | ✅ | "Watch video" (botão do Hero) e o texto do CTA não aparecem na página. Só constam no JSON de traduções embutido no HTML. |
| A15 — locales escritos à mão / locale inválido | ✅ (resolvido o ❓) | `/fr`, `/de`, `/edusat` → 200 com conteúdo em inglês e `lang` inválido; em produção ficam cacheados. |
| A16 — restos do template | ✅ | Confirmado por leitura do código (sem efeito visível observado). |
| A17 — dois `console.log` na mesma linha | ✅ | Confirmado por leitura do código. |
| A18 — `graphify-out/` não ignorado | ✅ (resolvido) | Já está no `.gitignore` (linha 44); `git check-ignore` confirma. |

### Itens D (documentação × código)

| Item | Resultado | Evidência |
|---|---|---|
| D1 — idioma padrão | ✅ | `/` sem `Accept-Language` → `/en`. O README (que diz PT) está errado. |
| D2 — versão do Node | ⚠️ | Rodou com Node **22.11.0** (não com o 20 do `.nvmrc`). O Next 16.0.8 exige `>=20.9.0`, então o "18.x" do README é incompatível. Node 18 e 20 não foram testados. |
| D3 — arquivos citados que não existem | ✅ | Os três `.md` e o `tailwind.config.ts` não existem, e o build funciona sem eles. |
| D4 — `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Não são lidas; o `mailto` gerado usa `admin@ideiaspace.com` fixo; o WhatsApp no HTML é `wa.me/5561991983152`. |
| D5 — variáveis não citadas no README | ✅ | `NEXT_PUBLIC_USE_CLOUDINARY` muda o comportamento (seção 6); `N2YO_API_KEY`/`SPACETRACK_*` mudam o `X-Data-Source`. |
| D6 — README lista só `/api/contact` | ✅ | O build lista `ƒ /api/contact` e `ƒ /api/satellites`. |
| D7 — componentes "ativos" não renderizados | ✅ | `AboutCarousel` não aparece no HTML de `/en/about`; nenhum botão flutuante de WhatsApp. |
| D8 — URL de clone | ✅ | Remote real: `ZarbL/IdeiaSpacewebsite`. |
| D9 — nomes das rotas | ✅ | No navegador: `/services` = "Desafio"/"Challenge", `/technologies` = "Recursos"/"Resources". |
| D10 — Three.js / react-globe.gl | ✅ | Não importados; o build e o typecheck passam sem eles. |
| D11 — validações do contato | ✅ | Tipo (número → 400) e tamanho (201 caracteres → 400) testados. |
| D12 — log `Contact form submission` | ✅ | Não aparece. Os logs reais são `RESEND_API_KEY not configured…`, `Email sent successfully: <id>` e `Error sending email: …`. |
| D13 — "lazy loading de imagens" | ✅ | Lint aponta 11 `<img>` sem `next/image`. |
| D14 — domínio e e-mail oficiais | ❓ | Não determinável pelo repositório. |

---

## Problemas encontrados

Falhas e comportamentos indesejados **observados na execução** (nenhum foi corrigido):

1. **Nenhum vídeo carrega sem `NEXT_PUBLIC_USE_CLOUDINARY=true`** (A1). Hero da Home preto; 404 em 8 URLs; erro no console em 5 das 6 páginas.
2. **Qualquer segmento vira "idioma"**: `/fr`, `/edusat` etc. respondem 200 com conteúdo em inglês e `lang` inválido, e ficam em cache em produção.
3. **Links quebrados no rodapé**: `/terms` e `/privacy` → 404; LinkedIn/Facebook com `href="#"`.
4. **Mensagens do formulário em português** em todas as versões de idioma.
5. **Hero de `/services` sem descrição** em `pt` e `en` (tradução vazia).
6. **39 vulnerabilidades** reportadas pelo `npm audit`, incluindo uma crítica no `next`.
7. **24 warnings de lint** (nenhum erro).
8. Aviso recorrente no build: `baseline-browser-mapping` desatualizado.
9. Pacotes depreciados na instalação (`glob@10`, `q`, `whatwg-encoding`).

Nenhuma etapa obrigatória (`npm ci`, `lint`, `typecheck`, testes, `build`) **falhou**.

---

## Pontos ainda não confirmados

| Ponto | Por que continua ❓ | Como poderia ser confirmado |
|---|---|---|
| Se a produção usa Cloudinary | Depende das variáveis no painel da Vercel (e de estarem no **build**) | Ver as variáveis do projeto na Vercel, ou inspecionar as URLs de vídeo no site público |
| Qual caminho de deploy está ativo (Git integration × `deploy.yml`) | Depende dos *secrets* `VERCEL_*` e do painel | Histórico de execuções do workflow `Deploy` e aba *Deployments* da Vercel |
| Quem consome `/api/satellites` | Nenhum código do repositório chama a rota | Perguntar ao time / ver o código de `tleideiaspaceview.vercel.app` |
| Comportamento real com Resend, Space-Track e N2YO | Exige credenciais (não usadas, por regra) | Ambiente de teste com credenciais próprias, nunca as de produção |
| Cache da API em ambiente serverless (A4) | Só observável na Vercel | Logs da função em produção (`X-Cache-Status`) |
| TLEs de fallback reais ou ilustrativos (A5) | Depende de conhecimento do domínio | Comparar com o catálogo público do Space-Track / perguntar ao time |
| Números de impacto oficiais (A11) | Decisão de negócio | Time IdeiaSpace |
| Domínio e e-mail oficiais (D14) | Quatro variantes no repositório | Time IdeiaSpace |
| Funcionamento com Node 18/20 | Só Node 22 estava disponível | Rodar com `nvm`/Volta em Node 20 (o CI já usa Node 20) |
| Fuzz com 3000 iterações | Só o padrão (200/300) foi executado | `FUZZ_RUNS=3000 npm run test:fuzz` |

---

## O que aprendi sobre o projeto

**1. O site é quase todo estático.** O build gera 18 páginas HTML prontas (6 rotas × 3 idiomas). Quando alguém acessa `/pt/about`, o servidor só entrega um arquivo já pronto. As únicas partes que rodam a cada requisição são o middleware de idioma (`proxy.ts`) e as duas APIs. Por isso o site é rápido e barato de hospedar.

**2. Variáveis `NEXT_PUBLIC_*` são "congeladas" no build.** Como as páginas são geradas no build, `getVideoUrl()` roda nesse momento e o resultado (`/assets/...` ou `https://res.cloudinary.com/...`) fica escrito no HTML. Mudar a variável depois, sem refazer o build, não muda nada. Esse é o ponto mais importante para a futura documentação de deploy.

**3. O caminho de cada vídeo depende de um único `if`.** `lib/cloudinary.ts` decide entre CDN e pasta local. A CDN tem os arquivos com os nomes certos; a pasta local tem os arquivos numa subpasta (`compressed/`) que o código não conhece. Por isso o site "funciona" ou "quebra" inteiro conforme uma variável.

**4. O idioma é decidido em três lugares diferentes.**
- `proxy.ts` decide **para onde redirecionar** `/` (pelo cabeçalho `Accept-Language` ou pelo cookie `NEXT_LOCALE`).
- `i18n.ts` decide **quais textos carregar** (cai para inglês se o idioma for inválido).
- `[locale]/layout.tsx` decide o **`lang` do HTML** (usa o valor da URL sem validar).

Como cada um faz uma coisa, uma URL como `/fr` passa pelos três e gera uma página "meio inglesa, meio francesa". Entender isso é essencial antes de adicionar um idioma novo.

**5. Todas as traduções vão para o navegador.** O layout entrega ao `NextIntlClientProvider` o JSON **completo** do idioma (~22 KB), então até textos de outras páginas (ex.: depoimentos de `/services`) estão dentro do HTML da Home. Funciona, e explica por que textos "não usados" como "Watch video" aparecem numa busca no HTML.

**6. As APIs foram feitas para nunca "quebrar" o site.** Sem credenciais, o formulário vira um link `mailto:` e a API de satélites devolve dados de exemplo, sempre com status 200 e cabeçalhos que dizem de onde veio o dado (`X-Cache-Status`, `X-Data-Source`). É por isso que o CI consegue rodar build e testes sem nenhum segredo.

**7. Os testes cobrem a lógica, não a interface.** Os 31 testes passam e cobrem bem as APIs e o helper de mídia, mas **nenhum** teste abriria o site num navegador. Por isso o problema dos vídeos (A1) passa pelo CI sem ser detectado: os testes de `cloudinary.ts` verificam que a função devolve `/assets/space.mp4`, mas não que esse arquivo existe.

**8. O lint funciona como um mini-auditor.** Os 24 warnings apontaram sozinhos vários achados da auditoria (imports mortos, `t` não usado, `<img>` sem otimização). Rodar `npm run lint` é um bom primeiro passo para estudar qualquer mudança.

---

## Próxima fase

A validação mostrou que **o código funciona como a auditoria descreveu**: instalação, testes e build passam, e os problemas reais são de **configuração e de entendimento** (variável no build, idioma decidido em três lugares, nomes de rotas trocados, mídia em dois lugares), não de lógica quebrada.

Esses problemas nascem de partes do sistema que conversam entre si sem estar explicadas em lugar nenhum. Por isso a próxima etapa útil é documentar a **arquitetura** (o futuro `docs/ARQUITETURA.md`). Ele deveria cobrir, pelo menos:

- o caminho de uma requisição (proxy → layouts → página → componentes), com os três pontos onde o idioma é decidido;
- o que é gerado no build e o que roda a cada requisição (SSG × dinâmico) e a consequência para variáveis `NEXT_PUBLIC_*`;
- o fluxo de mídia (local × Cloudinary) com os nomes e pastas reais;
- o mapa rota × rótulo do menu;
- o contrato das duas APIs e seus modos de fallback.

Também faz sentido corrigir o README (Fase 2 da auditoria) logo antes ou junto, porque vários itens D ficaram confirmados e o README hoje ensina coisas erradas (idioma padrão, Node 18, arquivos inexistentes).

Antes disso, vale levar ao time as perguntas da tabela "Pontos ainda não confirmados", principalmente: **a produção usa Cloudinary? qual é o domínio oficial? quem consome `/api/satellites`?**
