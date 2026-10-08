# Revisão Final da Documentação

> **Laudo** da revisão técnica adversarial feita em 08/10/2026 sobre o commit `71d104c` (branch `documentacao`). Não é documentação do projeto: registra o que cada documento afirma, o que o código e a execução mostram, e onde os dois divergem. Nenhum arquivo do projeto foi alterado nesta revisão. Este é o único arquivo novo.
>
> **Notação.** **X ≠ Y** significa "o documento afirma X; o código ou a execução mostra Y". Severidades: **CRÍTICO**, **ALTO**, **MÉDIO**, **BAIXO** e **OBSERVAÇÃO**, conforme os critérios da etapa 11 do pedido. Evidências usam `arquivo:linha`. Linhas de documentos referem-se ao commit `71d104c`.

---

## 1. Escopo

### 1.1 O que foi analisado

| Grupo | Itens |
|---|---|
| Documentos (17) | 10 oficiais versionados, `.env.example`, 5 materiais de estudo/auditoria locais e o relatório do Graphify (inventário na [seção 3](#3-inventário-documental)) |
| Código | Todo `src/` (páginas, layouts, `proxy.ts`, `routing.ts`, `i18n.ts`, 31 componentes, 6 seções, controller, model, `lib/`, 2 Route Handlers, 7 arquivos de teste), `messages/*.json`, `scripts/*.js` |
| Configuração | `package.json`, `package-lock.json`, `.nvmrc`, `next.config.ts`, `vercel.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `postcss.config.mjs`, `.gitignore`, `.gitattributes`, `.gitleaks.toml`, `.editorconfig`, os 5 workflows, templates e `CODEOWNERS` |
| Dependências (só leitura, como evidência de contrato) | `resend` 6.5.2 (`fetchRequest`), `next-intl` 4.5.5 (`syncCookie`), schema oficial do `vercel.json` |
| Ferramentas | Graphify (`graphify-out/`, gerado em `a71fa4c`), `@mermaid-js/mermaid-cli` (mermaid 11.17.2), `github-slugger` (algoritmo de âncoras do GitHub) |

### 1.2 Como foi validado

1. **Clone limpo** da URL do README (`git clone --branch documentacao https://github.com/ZarbL/IdeiaSpacewebsite.git`) num diretório temporário fora do repositório. O SHA conferido foi `71d104c`. Nenhum artefato local (`.next`, `coverage`, `node_modules`, `next-env.d.ts`, materiais de estudo) influenciou os resultados, e o repositório auditado ficou intocado.
2. **Comandos do pedido**, na ordem do CI, com o `typecheck` rodado **antes** de qualquer build:

   | Comando | Resultado |
   |---|---|
   | `GIT_LFS_SKIP_SMUDGE=1 git clone …` → `git lfs ls-files` → `git lfs pull` | Ponteiros de 131–132 bytes marcados com `-`; após o pull, `*` e tamanhos reais |
   | `npm ci` | ✅ 726 pacotes em 137 s; avisos de depreciação (`whatwg-encoding`, `q`, `glob`); 39 vulnerabilidades (4 críticas) |
   | `npm run lint` | ✅ 0 erros, 24 avisos (11 `no-img-element`, 9 `no-unused-vars`, 3 `no-explicit-any`, 1 `exhaustive-deps`) |
   | `npm run typecheck` (sem `next-env.d.ts`) | ✅ sem erros em 6 s |
   | `npm run test:run` | ✅ 7 arquivos, 31 testes |
   | `npm run test:ci` | ✅ cobertura 69,91 / 78,21 / 78,57 / 69,91 (limites 55/60/55/55) |
   | `npm run test:fuzz` e `FUZZ_RUNS=3000` (bash e PowerShell) | ✅ 2 arquivos, 5 testes, nos dois níveis |
   | `npm run build` (sem variáveis) | ✅ 30 s, Turbopack, "Running TypeScript", 18 páginas SSG, 2 APIs dinâmicas |
   | `npm run upload:large` · `npm run compress:videos` | `MODULE_NOT_FOUND` · "❌ FFmpeg not found" (como documentado) |

3. **Execução**: `next start` (produção) e `next dev --webpack`. Rotas, redirecionamentos, cookies, cabeçalhos, locales inválidos, 404, assets e as duas APIs foram exercitados com `curl`.
4. **Simulações sem serviços externos**: Resend inalcançável (`RESEND_BASE_URL` apontando para uma porta local fechada) e Resend recusando o envio (stub HTTP local respondendo `403`). Nenhuma credencial real foi usada, e não houve chamada ao Resend, à N2YO nem ao Space-Track.
5. **Verificações externas somente leitura**:
   - CDN pública do Cloudinary, com GET de 1 byte;
   - API pública do GitHub, sem autenticação;
   - site em produção, com GET;
   - schema `https://openapi.vercel.sh/vercel.json`;
   - links externos do menu.

### 1.3 Ambiente e limitações

- Windows 11, **Node 22.11.0** (o `.nvmrc` pede 20; não há gerenciador de versões na máquina), npm 11.6.1, git-lfs 3.6.0, PowerShell 5.1. FFmpeg e `gh` ausentes. **Node 20 não foi testado localmente.** O CI de `main`, que usa Node 20, está verde (ver a [seção 8](#8-informações-que-continuam-incertas)).
- `next dev` com Turbopack não rodou no clone temporário. O caminho do diretório passou do limite de 260 caracteres do Windows, e o Turbopack falhou com "path length … exceeds max length of filesystem" (ver O03). Os testes específicos do modo dev usaram `next dev --webpack`; os demais usaram build e servidor de produção com Turbopack.
- Não houve navegador automatizado. Comportamentos de clique foram avaliados pelo código e pelo HTML gerado.
- Painel da Vercel, *secrets* do GitHub e contas externas não foram acessados.

---

## 2. Estado geral

### Avaliação: **adequada com correções**

**Por que não "boa":**

- **1 problema crítico (P01).** Três documentos descrevem ao contrário o que acontece quando o envio pelo Resend falha. Eles afirmam `500` com link `mailto:`. Na realidade, a API responde `200` com "Mensagem enviada com sucesso!" e a mensagem se perde. Isso foi reproduzido duas vezes.
- **2 problemas altos.** O fluxo de branches documentado (`dev`) não existe na prática (P02), e o estado de segurança (PR #1 aberto e alerta crítico no `next`) não aparece em nenhum documento (P03).
- **8 médios**, quase todos sobre **deploy** e **verificação**: o que o `vercel.json` realmente faz, um smoke test que nunca valida nada, testes descritos como mais abrangentes do que são e "CI obrigatório" sem proteção de branch.
- **Padrão de causa.** Os erros mais graves nasceram de leituras do código que ignoraram o **contrato real das dependências** (SDK do Resend, next-intl, schema da Vercel). Por causa da redundância entre documentos, cada erro se espalhou por 3 a 6 arquivos.

**Por que não "necessita revisão importante":**

- A maior parte das afirmações técnicas foi **confirmada na execução** (seção 6): instalação, build, SSG, i18n, mídia, fallbacks, testes, cabeçalhos e o comportamento de locales inválidos, inclusive em produção.
- Os **107 links relativos e âncoras** dos documentos oficiais estão corretos. Os **8 diagramas Mermaid** são sintaticamente válidos. O `.env.example` é seguro e equivale a não ter variáveis. Não há segredo exposto.
- O conjunto é **coeso na divisão de papéis**: README → Guia Operacional → Arquitetura → API, com links cruzados corretos.

| Severidade | Quantidade |
|---|---|
| CRÍTICO | 1 |
| ALTO | 2 |
| MÉDIO | 8 |
| BAIXO | 21 |
| OBSERVAÇÃO | 9 |

---

## 3. Inventário documental

| # | Documento | Classificação | Versionado | Objetivo | Público | Confiança | Relações e sobreposições |
|---|---|---|---|---|---|---|---|
| 1 | `README.md` | Oficial — entrada | Sim | Visão geral, setup rápido, índice | Quem acabou de clonar | Alta, com P02 e P04 | Resume GUIA, ARQUITETURA e API. Repete setup, variáveis e branches do CONTRIBUTING |
| 2 | `docs/GUIA_OPERACIONAL.md` | Oficial — runbook | Sim | Setup detalhado, comandos, deploy, troubleshooting | Dev em atividade | Média-alta (P01, P02, P04, P05, P08) | Continua o README. Repete o deploy do CI-CD e as variáveis do `.env.example` |
| 3 | `docs/ARQUITETURA.md` | Oficial — arquitetura | Sim | Como as partes se relacionam | Quem vai alterar código | Alta (P01, P06, P07, P13) | Fonte técnica central. O §11 repete a API; o §9 repete as rotas do README |
| 4 | `API_DOCUMENTATION.md` | Oficial — API | Sim | Contrato de `/api/contact` e `/api/satellites` | Dev e consumidor HTTP | Média (P01, P07, P14, P15) | Detalha o §11 da ARQUITETURA |
| 5 | `CONTRIBUTING.md` | Oficial — contribuição | Sim | Fluxo de branches, setup, testes | Contribuidor | Média (P02, P09) | Repete README e GUIA |
| 6 | `SECURITY.md` | Oficial — segurança | Sim | Canal de reporte e superfície de ataque | Pesquisador, mantenedor | Média (P03, P21) | Aponta para issues #3 e #4 |
| 7 | `CHANGELOG.md` | Oficial — changelog | Sim | Histórico de mudanças | Time | Baixa-média, desatualizado (P22) | Repete "Corrigidos" do BACKLOG |
| 8 | `docs/CI-CD.md` | Oficial — CI/CD | Sim | Workflows, secrets, deploy | Mantenedor | Média (P04, P05) | Repete o §6 do GUIA |
| 9 | `docs/BACKLOG.md` | Oficial — backlog | Sim | Índice das issues #3–#8 | Time | Média, incompleto (P03) | Issues conferidas no GitHub |
| 10 | `.github/pull_request_template.md` | Oficial — processo | Sim | Checklist de PR | Contribuidor | Alta | Repete a sequência do CI |
| 11 | `.env.example` | Configuração documentada | Sim | Contrato de variáveis | Quem roda o projeto | Alta (P12 e P18, menores) | Repete README, CONTRIBUTING e GUIA |
| 12 | `AUDITORIA_INICIAL.md` | Auditoria (estudo) | Não; ignorado, mas **presente no histórico público** (`ee19572`–`7c4b63f`) | Retrato do código em `a71fa4c` | Autor | Média: *snapshot*, origem de P01 | Base das Fases 1–4 |
| 13 | `docs/FASE-1-VALIDACAO.md` | Validação (estudo) | Não; ignorado, presente no histórico (`b53ec0c`) | Registro de execução em `ee19572` | Autor | Média-alta | Responde à auditoria |
| 14 | `docs/FASE-2-ARQUITETURA-ESTUDO.md` | Estudo | Não; ignorado, presente no histórico (`cc59d95`) | Como chegar à arquitetura | Estudante | Alta (P29, menor) | Complementa a ARQUITETURA |
| 15 | `docs/FASE-3-DOCUMENTACAO-ESTUDO.md` | Estudo | Nunca versionado | Por que e como a documentação foi reescrita | Estudante | Média-alta (P11) | Explica README e `.env.example` |
| 16 | `docs/FASE-4-OPERACAO-ESTUDO.md` | Estudo | Nunca versionado | README × runbook; scripts × CI | Estudante | Alta | Explica o GUIA |
| 17 | `graphify-out/GRAPH_REPORT.md` | Ferramenta (gerado) | Nunca versionado | Grafo de dependências | Auditor | Alta para código; **defasado para documentação** | Usado pela auditoria |

**Coesão do conjunto.**

- Os papéis estão bem separados, e nenhum documento oficial aponta para arquivo ignorado: `git grep` não encontra referências, e o verificador de links não acusou nada.
- **Fragilidades:**
  - há **sobreposição alta** (seção 11);
  - **nenhum documento descreve o deploy real** (Git integration ativa, previews por branch, deploy via Actions inativo, smoke test inócuo);
  - o **BACKLOG não reflete os limites conhecidos** listados no §14 da ARQUITETURA.

---

## 4. Matriz de consistência

| Informação | Código / realidade observada | Documento A | Documento B | Resultado |
|---|---|---|---|---|
| Versão do Node | `.nvmrc` = 20; `next` exige `>=20.9.0`; Node 22 funciona; CI de `main` usa 20 e está verde | README:50 "Node.js 20" | GUIA:22,31 "20 (mín. 20.9); acima de 20 funciona" | ✅ Consistente. Node 20 está em fim de vida (O01) |
| Idioma padrão | `src/routing.ts:9` `en`; `/` sem `Accept-Language` → `307 /en` | README:156 | ARQUITETURA:194 | ✅ |
| Detecção em `/` | Cookie > `Accept-Language` > `en`; `307` | README:157 | ARQUITETURA:128 | ✅ |
| Gravação do cookie `NEXT_LOCALE` | Só quando não há cookie **e** o idioma da URL difere do `Accept-Language`, ou quando o cookie está desatualizado; cookie de sessão | ARQUITETURA:133,199 "grava/atualiza" em toda página | GUIA:357 "gravado ao visitar qualquer página com idioma" | ❌ X ≠ Y (P06) |
| Primeiro segmento inválido | `200`, conteúdo em inglês, `lang` inválido, cache `HIT`; `/about` → **Home**; um link herda o segmento inválido | ARQUITETURA:239-245 "página correspondente", "links apontam para `/en`" | GUIA:358 "Home em inglês" | ⚠️ Parcial (P13) |
| Páginas geradas | 6 rotas × 3 idiomas = 18 SSG; `ƒ` para as 2 APIs | README:219 | ARQUITETURA:300; GUIA:119 | ✅ |
| Saída estática | `○ /_not-found`, `○ /icon.png` | ARQUITETURA:301 | FASE-1:134-149 | ✅ |
| `NEXT_PUBLIC_*` no build | Valor embutido no build; runtime não altera nem páginas geradas sob demanda | README:97 | ARQUITETURA:354-377 | ✅ no build · ⚠️ no `next dev` (P12) |
| `NEXT_PUBLIC_*` no `next dev` | `Reload env: .env.local` sem reiniciar | `.env.example`:19-20 "ao iniciar o `next dev`" | ARQUITETURA:376 "lido quando o servidor inicia" | ⚠️ X ≠ Y (P12) |
| Vídeos no modo local | `/assets/<n>.mp4` → 404; `/assets/compressed/<n>.mp4` → 206 | README:80 | ARQUITETURA:423; GUIA 7.1 | ✅ |
| Cloudinary | URLs `q_auto:eco,f_auto` (vídeo) e `q_80,f_auto` (imagem); todos os assets usados existem; **produção usa a CDN** | README:223 | ARQUITETURA §8; GUIA:99 | ✅ |
| Falha do Resend | `200 {"success":true,"message":"Mensagem enviada com sucesso!…"}` e log `Email sent successfully: undefined` | API_DOCUMENTATION:255-263,283 "500 + mailto" | ARQUITETURA:584; GUIA:313 | ❌ X ≠ Y (P01) |
| `mailto` em resposta 500 | O formulário só redireciona se `response.ok` | API_DOCUMENTATION:419 | ARQUITETURA:588,591 | ❌ X ≠ Y (P07) |
| IDs do grupo `weather` | 21 IDs (`route.ts:34-69`) | API_DOCUMENTATION:122 "22" | FASE-1:262 "22" | ❌ X ≠ Y (P14) |
| Cobertura de `STALE` / TLE inválido | Linhas `route.ts:322-337` e `358-368` nunca executadas | GUIA:347 "cobertos" | API_DOCUMENTATION:297; ARQUITETURA:646 | ❌/⚠️ (P08) |
| Chaves de tradução | Teste conta **198** por idioma; 204 só contando os 7 itens de um array | ARQUITETURA:187 "204 … garantido pelo teste" | AUDITORIA:130 "204" | ⚠️ (P16) |
| Scripts de mídia | `upload:large` inexistente; `compress:videos` exige FFmpeg; `generate-favicon.js` quebrado | README:117; GUIA:129,363 | README:182 e ARQUITETURA:91 citam favicon sem ressalva | ⚠️ (P17) |
| Fluxo de branches | PRs #2 e #9 foram para `main`; `origin/dev` está 1 à frente e 12 atrás, sem nenhuma execução de CI | CONTRIBUTING:32,38 "a partir de `dev`, PR para `dev`" | README:246; GUIA:157,171,184-190 | ❌ X ≠ Y (P02) |
| CI como requisito | `main`: `protected=false` | README:246; CONTRIBUTING:38 "obrigatório" | CI-CD.md:35-38 "sugerida" | ❌ Contradição (P09) |
| Instalação na Vercel | `vercel.json:5` `npm install` | GUIA:215 (documenta a divergência) | — | ✅ |
| Git LFS na Vercel | O schema oficial **não tem** `git.lfs` | README:221 "Git LFS habilitado" | ARQUITETURA:633; GUIA:194 | ❌ X ≠ Y (P04) |
| Deploy automático | `deploymentEnabled.main:true` é o padrão; **todas** as branches geram Preview | CI-CD.md:20 "o `vercel.json` habilita" | GUIA:193 | ⚠️ (P04) |
| Mecanismo de deploy ativo | Git integration (Production por `vercel[bot]`); `deploy.yml` pulou: "VERCEL_TOKEN ausente" | GUIA:204 "não está no código" | FASE-1:353 ❓ | ✅ Resolvido nesta revisão (seção 8) |
| Smoke test | `curl` sem `-L` recebe 307; anotação "não respondeu 200" no último deploy | README:222 | CI-CD.md:14; GUIA:200-201 | ⚠️ (P05) |
| Região | `x-vercel-id: gru1::…` em produção | README:221 | ARQUITETURA:631 | ✅ |
| Testes | 7 arquivos, 31 testes, sem testes de componente nem E2E | ARQUITETURA:652-654 | README:213 | ✅ |
| Código não utilizado | 13 módulos sem importador + `AboutCarousel` importado e não renderizado (grep e Graphify) | ARQUITETURA:673 | AUDITORIA:308-314 | ✅ |
| Repositório público | `private: false` | SECURITY.md:5 | CI-CD.md:12 | ✅ |
| Domínio e e-mails | Site em `www.ideiaspace.com.br`; `ideiaspace.com` redireciona para `.com.br`; formulário envia para `admin@ideiaspace.com`; SECURITY usa `contato@ideiaspace.com.br` | SECURITY.md:7 | `route.ts:79,90` | ⚠️ Depende do time (P21) |

---

## 5. Problemas encontrados

### 5.1 CRÍTICO

| ID | Severidade | Documento | Problema | Evidência | Correção sugerida |
|---|---|---|---|---|---|
| P01 | CRÍTICO | `API_DOCUMENTATION.md:255-263,283,295`; `docs/ARQUITETURA.md:583-588,644`; `docs/GUIA_OPERACIONAL.md:313` (origem: `AUDITORIA_INICIAL.md:217`) | **"Falha no envio pelo Resend → `500` + `mailtoLink`" ≠ "falha → `200` com sucesso falso".** O GUIA chega a prever: "o Resend pode recusar o envio… a API responde `500` com o `mailtoLink` e o terminal registra `Error sending email`". O operador que seguir o documento vai concluir que o e-mail foi enviado | O SDK `resend` 6.5.2 **não lança exceção** em erro HTTP nem de rede: devolve `{data:null, error}` (`node_modules/resend/dist/index.mjs:791-842`). A rota ignora `error` (`src/app/api/contact/route.ts:88-189`). **Reproduzido**: com o Resend inalcançável e com recusa `403` simulada, a resposta foi `200 {"success":true,"message":"Mensagem enviada com sucesso! Entraremos em contato em breve."}` e o log `Email sent successfully: undefined`. O teste que "comprova" o 500 usa `mockRejectedValue` (`contact.test.ts:89-95`), um contrato que o SDK real não segue | Descrever o comportamento real nos três documentos (texto e o diagrama da ARQUITETURA §11) e marcá-lo como defeito conhecido. Na seção "Estado de Verificação", registrar que o mock não reproduz o contrato do SDK. A correção do código e do teste fica para a Fase 5 |

### 5.2 ALTO

| ID | Severidade | Documento | Problema | Evidência | Correção sugerida |
|---|---|---|---|---|---|
| P02 | ALTO | `CONTRIBUTING.md:32,38`; `README.md:246`; `docs/GUIA_OPERACIONAL.md:157,171,184-190` | **"Branch a partir de `dev`, PR para `dev`, `dev` → `main`" ≠ prática do repositório.** Seguir a instrução hoje cria trabalho sobre um código sem CI, sem testes e sem esta documentação, num PR que não chega à produção | `git rev-list --left-right --count origin/dev...origin/main` = `1 12`. `origin/dev` tem um commit divergente ("satélite 3D", 08/09/2026) e **0** execuções de workflow. API do GitHub: PR #2 `chore/ci-cd-quality → main` e PR #9 `fix/stats-card-counters → main` | O time decide o fluxo: (a) PRs direto para `main`, ou (b) sincronizar `dev` e passar a usá-lo. Depois, ajustar os três documentos e o diagrama do GUIA §6.1 |
| P03 | ALTO | `docs/BACKLOG.md`; `SECURITY.md:9-21`; `CHANGELOG.md`; `docs/GUIA_OPERACIONAL.md:64` | **Omissão do estado de segurança.** Nenhum documento cita o **PR #1 aberto** ("Fix React Server Components RCE vulnerability", do `vercel[bot]`, aberto desde 11/12/2025) nem o alerta **crítico** no `next`, que é dependência direta. O GUIA trata o resumo do `npm audit` como ruído ("não impede o funcionamento"). A Fase 5 pode ser priorizada sem o item de segurança mais relevante | API do GitHub: `/pulls/1` aberto, base `main`. `npm audit --omit=dev` (nesta revisão): 11 vulnerabilidades (1 crítica em `next`, 6 altas: `lodash`, `lodash-es`, `nanoid`, `postcss`, `sharp`, `source-map-js`) | Registrar no BACKLOG e no SECURITY o PR #1 e o resultado do `npm audit`, com prioridade, e citar no GUIA §2.2 que o resumo do audit contém alertas reais. A atualização em si fica para a Fase 5 |

### 5.3 MÉDIO

| ID | Severidade | Documento | Problema | Evidência | Correção sugerida |
|---|---|---|---|---|---|
| P04 | MÉDIO | `README.md:221`; `docs/ARQUITETURA.md:631,633`; `docs/GUIA_OPERACIONAL.md:193-194`; `docs/CI-CD.md:3-4,20` | **"O `vercel.json` habilita o deploy automático de `main` e o Git LFS" ≠ schema oficial.** Não existe chave `git.lfs`. `deploymentEnabled` só **desliga** as branches listadas; as demais fazem deploy por padrão, então `{"main": true}` não muda nada. Os documentos também omitem que **toda branch gera um deploy de Preview** | Schema `openapi.vercel.sh/vercel.json`: `git` aceita `deploymentEnabled`, `exclusivity` e `skipUnaffectedProjects`, e há **0** menções a "lfs". A descrição de `deploymentEnabled` diz: "Any non specified branch is `true` by default". API do GitHub (`/deployments`): Previews para `71d104c`, `7c4b63f` (`documentacao`), `e80cf1e` (`dev`) e outros; Production para `main` | Descrever o deploy como feito pela Git integration (configuração do painel), com Preview para todas as branches. Tratar o LFS na Vercel como configuração do painel, não do `vercel.json`. Remover ou corrigir a chave na Fase 5 |
| P05 | MÉDIO | `README.md:222`; `docs/CI-CD.md:14,21`; `docs/GUIA_OPERACIONAL.md:200-201` | **Smoke test descrito como verificação ≠ nunca pode passar.** O `curl` não segue redirecionamentos, e tanto o apex quanto `/` respondem `307`. O job continua verde | `deploy.yml:50-56`. `https://ideiaspace.com.br` → `307` → `https://www.ideiaspace.com.br/` → `307 /en`. Execução 37491482358 (06/10/2026): anotação "https://ideiaspace.com.br não respondeu 200" | Documentar a limitação agora. Na Fase 5, ajustar o workflow (`-L` ou URL final, por exemplo `/en`) |
| P06 | MÉDIO | `docs/ARQUITETURA.md:113,133,199,210`; `docs/GUIA_OPERACIONAL.md:357` | **"O proxy grava ou atualiza `NEXT_LOCALE` em toda página com prefixo" ≠ `next-intl` 4.5.5.** O cookie só é gravado se não existir e o idioma da URL diferir do `Accept-Language`, ou se o cookie estiver desatualizado. É cookie de sessão. O efeito no redirecionamento de `/` é equivalente; a explicação é que está errada | `syncCookie.js:3-17`. `curl`: `/pt` com `Accept-Language: pt-BR` → **sem** `Set-Cookie`; com `en-US` → `NEXT_LOCALE=pt; Path=/; SameSite=lax` | Reescrever as quatro passagens e o diagrama de sequência (§3) com a regra real |
| P07 | MÉDIO | `API_DOCUMENTATION.md:419-438`; `docs/ARQUITETURA.md:585-591` | **"Quando a resposta traz `useMailto`, o formulário redireciona" ≠ só redireciona com `response.ok`.** No `500`, o visitante lê "Abrindo cliente de email…", mas nada abre. O exemplo de front-end da API redireciona independentemente do status | `src/components/ContactForm.tsx:46-72` | Corrigir texto e diagrama (aresta `E500 → mailto`); avisar que o exemplo difere da implementação |
| P08 | MÉDIO | `docs/GUIA_OPERACIONAL.md:347`; `API_DOCUMENTATION.md:297`; `docs/ARQUITETURA.md:646`; `CHANGELOG.md:14` | **"MISS, HIT, STALE e TLE inválido são cobertos pelos testes" ≠ cobertura medida.** Nenhum caminho `STALE` executa. O teste chamado "TLE inválido" termina no fallback por outro ramo ("Nenhum TLE recebido", erro de parse do JSON), sem passar por `isValidTLE` | `lcov` desta revisão: `route.ts` 322-337 e 358-368 nunca executadas (também todo o Space-Track, 176-210 e 264-269). `satellites.test.ts:67-74` | Listar o que é de fato coberto. Registrar `STALE` e a validação de TLE como não testados |
| P09 | MÉDIO | `README.md:246`; `CONTRIBUTING.md:38` × `docs/CI-CD.md:35-38` | **"CI verde obrigatório" ≠ nenhuma regra aplicada.** O CI-CD fala em proteção "sugerida" | API do GitHub: `main` com `protected=false`. Antes do PR #2, havia commits diretos em `main` (`ed66a46`, `ef62c4d`…) | Usar "esperado" em vez de "obrigatório", ou ativar a proteção e então manter a palavra |
| P10 | MÉDIO | `docs/ARQUITETURA.md:133` e §14 (lacuna) | **O cabeçalho `Link` (hreflang) é citado, mas não o efeito do `x-default`.** Ele aponta para a URL sem prefixo (`/about`), que cai no comportamento de locale inválido. Em produção, a URL anunciada aos buscadores devolve a Home com `lang="about"` | Produção: `Link` de `/pt/about` contém `<https://www.ideiaspace.com.br/about>; hreflang="x-default"`, e essa URL responde `200`, `<html lang="about">`, h1 "Welcome to Ideia Space" | Acrescentar ao §14 (limite conhecido com impacto em SEO) e ao backlog da Fase 5 |
| P11 | MÉDIO | `docs/FASE-3-DOCUMENTACAO-ESTUDO.md:143` | **"A allowlist `*.example` do gitleaks é uma camada extra de segurança" ≠ isenção de varredura.** Um segredo real colado por engano no `.env.example` não seria detectado | `.gitleaks.toml:11` (`'''.*\.example$'''`) | Corrigir o material de estudo. Na Fase 5, avaliar restringir a allowlist ao formato `VAR=` vazio |

### 5.4 BAIXO

| ID | Severidade | Documento | Problema | Evidência | Correção sugerida |
|---|---|---|---|---|---|
| P12 | BAIXO | `README.md:97`; `CONTRIBUTING.md:27-28`; `.env.example:19-20`; `docs/ARQUITETURA.md:376,665`; `docs/GUIA_OPERACIONAL.md:106,238,246,354` | "No `next dev`, o valor é lido ao iniciar; mudar exige reiniciar" ≠ o Next recarrega `.env.local` sem reinício. Reiniciar continua funcionando, então a instrução é inofensiva; a explicação é que está imprecisa | `next dev --webpack`: log `Reload env: .env.local`, e a requisição seguinte já trouxe URLs `res.cloudinary.com`. Não foi verificado com Turbopack (ver 1.3) | "Mudanças no `.env.local` costumam ser recarregadas; se não refletirem, reinicie" |
| P13 | BAIXO | `docs/ARQUITETURA.md:239-245` | "O conteúdo é a página correspondente" e "os links apontam para `/en/...`" ≠ `/about` sem prefixo renderiza a **Home**, e o link de Recursos herda o segmento inválido (`/fr/technologies`, `/about/technologies`) | `curl`: `/about` → `lang="about"`, h1 da Home. `TechnologiesSection.tsx:8-9,32` (`useParams`) e `ResourceCard.tsx:21-23` | Ajustar a lista de consequências; o GUIA:358 já está correto |
| P14 | BAIXO | `API_DOCUMENTATION.md:122` (também FASE-1:262,294 e AUDITORIA:677) | "`weather`: 22 IDs" ≠ 21. A lista do próprio documento (linhas 89-95) soma 21 | `route.ts:34-69` (contagem por script) | Trocar para 21 |
| P15 | BAIXO | `API_DOCUMENTATION.md:115` | "O fallback é um subconjunto de cada grupo" ≠ o fallback `starlink` tem 4 IDs fora da lista configurada (44716, 44717, 44719, 44720) | `route.ts:28-33` × `93-122` | "São TLEs ilustrativos; no `starlink`, 4 IDs não pertencem à lista" |
| P16 | BAIXO | `docs/ARQUITETURA.md:187` | "204 chaves, garantido pelo teste" ≠ o teste conta 198. O número 204 só aparece contando os 7 itens de `services.ecosystem.items`, e o teste não compara elementos de array | `messages-parity.test.ts:8-14`; contagem por script | "198 chaves (o array conta como uma)" e a limitação do teste |
| P17 | BAIXO | `README.md:182`; `docs/ARQUITETURA.md:91` | Script de favicon apresentado como funcional ≠ lê `src/app/icon.svg`, que não existe, e usa `sharp` sem declarar a dependência | `scripts/generate-favicon.js:1,5`; `src/app/` sem `icon.svg`. A AUDITORIA:400 registrava isso; os documentos oficiais perderam a ressalva | Acrescentar "(não funcional: falta `src/app/icon.svg`)" |
| P18 | BAIXO | `README.md:91`; `.env.example:27-29` | "Sem `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, usa o padrão", válido também para o script ≠ o script de upload não tem padrão | `scripts/upload-to-cloudinary.js:8`. O GUIA:102 está correto | Dizer que o padrão vale só para o site |
| P19 | BAIXO | `API_DOCUMENTATION.md:343,486` | "Verifique o domínio no Resend" como solução ≠ o remetente é fixo (`onboarding@resend.dev`); verificar um domínio não muda nada sem alterar o código | `route.ts:89` | Explicar que o remetente é fixo e que o uso de domínio próprio exige mudança no código |
| P20 | BAIXO | `docs/ARQUITETURA.md:247`; `docs/GUIA_OPERACIONAL.md:359` | "Caminhos inexistentes respondem 404 normalmente; não indica problema no setup" ≠ não há `not-found.tsx`, e o layout raiz não tem `<html>`. Em produção, o 404 é a página padrão do Next, sem layout do site e sem `<html>`. Em **dev**, aparece o erro "Missing `<html>` and `<body>` tags in the root layout", que parece problema de setup | `src/app/layout.tsx:1-7`. `curl` em produção: 0 `<html>`. Em dev: `NEXT_MISSING_ROOT_TAGS` | Registrar no GUIA §7.5 e no §14 da ARQUITETURA |
| P21 | BAIXO | `SECURITY.md:7,16-18` | Lista de segredos ("apenas `RESEND_API_KEY`, `N2YO_API_KEY`, `SPACETRACK_*`") ≠ também existem `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` (script) e `VERCEL_TOKEN` (CI). O canal `contato@ideiaspace.com.br` não foi confirmado, e o site usa `admin@ideiaspace.com` | `.env.example:57-58`; `deploy.yml:36`; `route.ts:79,90` | Completar a lista e confirmar com o time o e-mail oficial |
| P22 | BAIXO | `CHANGELOG.md:3-35,34`; `eslint.config.mjs:16` | O changelog para no PR de CI ≠ os commits de documentação (`.env.example`, README, ARQUITETURA, GUIA) não aparecem. Os "scripts Node de build" ≠ ARQUITETURA:91: "não fazem parte do build" | `git log`: `86a1935`, `8563c20`, `cc59d95`, `71d104c` | Adicionar as entradas; padronizar o termo "scripts de manutenção de mídia" |
| P23 | BAIXO | `docs/GUIA_OPERACIONAL.md:30` | "Com nvm, fnm ou Volta, basta `nvm use`" ≠ o fnm usa `fnm use`, e o Volta não lê `.nvmrc` (conhecimento externo; conferir na documentação de cada ferramenta) | — | Citar o comando de cada ferramenta |
| P24 | BAIXO | `docs/ARQUITETURA.md:269,290`; `vitest.setup.ts:9` | `ScrollIndicator` aparece como Client Component, mas não entra na lista dos que não usam recurso de navegador (só usa `useTranslations`; o `<button>` não tem `onClick`). O comentário do setup diz que ele usa `IntersectionObserver`, o que não acontece | `src/components/ScrollIndicator.tsx:1-20` | Incluí-lo na lista do §5; o comentário fica para a Fase 5 |
| P25 | BAIXO | `docs/ARQUITETURA.md:670` | "HTML nas traduções" omite que `MissionBadges` **converte** `**…**` e `\n\n` em HTML e usa `dangerouslySetInnerHTML` (a issue #6 conta 6 lugares) | `MissionBadges.tsx:26-27,60` | Mencionar o caso |
| P26 | BAIXO | `CHANGELOG.md:29-30`; documentos oficiais (lacuna) | "Placeholders removidos" ≠ continuam valores vazios (`hero.subtitle` e `missions.hero.subtitle` nos 3 idiomas; `services.spaceChallenge.description` em `en` e `pt`; `services.spaceChallenge.button` em `pt`), nomes "Partner 4–9" e LinkedIn `#`. O namespace `teacherResources`, pedido pela página, não existe. Nada disso está na documentação oficial | Script em `messages/*.json`; `messages-parity.test.ts:40-41`; `teacher-resources/page.tsx:9`; `PartnersCarousel.tsx:12-17` | Registrar no §14 da ARQUITETURA e no backlog de conteúdo |
| P27 | BAIXO | `API_DOCUMENTATION.md:15,18,111,253` | "Three-Line" (l. 15) × "Two-Line Element Set" (l. 18). O timeout de 20 s é global para o lote, não por requisição. Valores *falsy* não-string (por exemplo `"name": 0`) retornam "Todos os campos são obrigatórios", não "Campo inválido" | `route.ts:275-276,35`. `curl`: `{"name":0,…}` → `400 "Todos os campos são obrigatórios"` | Uniformizar o termo (3LE/TLE) e precisar o timeout e a validação |
| P28 | BAIXO | `README.md:177`; `CONTRIBUTING.md:11,63` | A árvore do README descreve `docs/` sem o Guia Operacional. O CONTRIBUTING lista `lib/ # cloudinary, wordpress, assets` sem dizer que dois não são usados, e o setup omite `git lfs install` (README e GUIA incluem) | — | Ajustes de uma linha |
| P29 | BAIXO | `docs/FASE-2-ARQUITETURA-ESTUDO.md:9,205,254,265` | "A arquitetura não está escrita em nenhum lugar" (desatualizado). "As APIs são as únicas partes dinâmicas" omite o proxy (`ƒ Proxy`). A pergunta 2 ("não recebe o cookie") é ambígua: o navegador **envia** o cookie para `/api`; o proxy é que não roda ali | Saída do build | Ajustar o material de estudo |
| P30 | BAIXO | `AUDITORIA_INICIAL.md:149,217,415` | "33 componentes" ≠ 31. "Erro no envio → 500" ≠ comportamento real (origem de P01). "Deploy automático **apenas** para `main`" ≠ todas as branches geram Preview | `git ls-files 'src/components/*.tsx'` = 31; API `/deployments` | Anotar as correções no próprio documento de estudo |
| P31 | BAIXO | `docs/ARQUITETURA.md:103-121,387-403` | Simplificações que podem confundir. No diagrama de sequência, `Pg->>C: getTranslations(...)` (a página chama as funções; não as envia aos componentes) e `C-->>B: HTML`, sem o layout raiz. No pipeline de mídia, só aparece o caminho dos vídeos; o upload de imagens a partir de `public/assets` não está representado | Revisão nó a nó (seção 9.3) | Rotular as setas como "chama" e acrescentar o ramo de imagens |
| P32 | BAIXO | `API_DOCUMENTATION.md:364-365,509` | "Versão 1.0.0" sem política de versão (o `package.json` está em `0.1.0`). Limites de planos de terceiros possivelmente desatualizados (ex.: "Plano Pago a partir de 3.000 e-mails/mês"); o próprio documento ressalva (linha 350) | — | Remover a versão ou explicar o critério; conferir os limites nos sites dos provedores |

### 5.5 OBSERVAÇÕES

| ID | Severidade | Documento | Observação | Evidência | Sugestão |
|---|---|---|---|---|---|
| O01 | OBSERVAÇÃO | README:50; GUIA:22; ARQUITETURA:5 | O projeto fixa Node 20, que entrou em fim de vida em 30/04/2026 (calendário oficial do Node.js; conferir). O repositório não define `engines`, então a versão usada na Vercel depende do painel | `.nvmrc`; `package.json` sem `engines`. Anotações do GitHub Actions: "Node.js 20 is deprecated" | Decidir a atualização na Fase 5; documentar onde a versão de produção é definida |
| O02 | OBSERVAÇÃO | — | A branch `documentacao` **nunca passou pelo CI** (0 execuções): o `ci.yml` só roda em push para `main`/`dev` e em PRs. `main` está 2 commits à frente (PR #9: estatísticas 6 e 1600+). A Vercel gerou Preview com sucesso para `71d104c` | API `/actions/runs?branch=documentacao`; status do commit `71d104c` | Abrir PR para `main` antes de mesclar. Conflitos são improváveis (o PR #9 só mexe em `messages/`) |
| O03 | OBSERVAÇÃO | GUIA §7 | No Windows, `next dev` (Turbopack) falha em diretórios profundos por limite de caminho. Não ocorre no caminho atual do repositório (a Fase 1 rodou normalmente) | Pânico do Turbopack: "path length … exceeds max length of filesystem" | Linha opcional no troubleshooting: clonar em caminho curto ou usar `--webpack` |
| O04 | OBSERVAÇÃO | `.gitignore:47-50` | Os "materiais de estudo pessoais" continuam acessíveis no **histórico público** (`AUDITORIA_INICIAL.md`, `FASE-1`, `FASE-2`); os commits `7c4b63f` e `b763f93` só deixaram de rastreá-los | `git log --all`; repositório público | Decisão do autor; o conteúdo não tem segredos |
| O05 | OBSERVAÇÃO | API_DOCUMENTATION:26 | `groups` aceita **um** grupo: `groups=stations,starlink` cai em `stations`. A chave do cache é a string recebida, sem limite de tamanho (ponto de código para a Fase 5) | `curl`; `route.ts:214,244,340` | Dizer "um grupo por requisição" |
| O06 | OBSERVAÇÃO | GUIA:218 | Existem Previews por branch, e não se sabe quais variáveis o ambiente Preview recebe (por exemplo, se os Previews usam Cloudinary) | API `/deployments` | Registrar após consultar o painel |
| O07 | OBSERVAÇÃO | GUIA:357 | `NEXT_LOCALE` é cookie de **sessão** (sem `Max-Age`): some ao fechar o navegador | `Set-Cookie: NEXT_LOCALE=pt; Path=/; SameSite=lax` | Complementar a linha do troubleshooting |
| O08 | OBSERVAÇÃO | GUIA:149 | Sem FFmpeg, o `compress:videos` encerra com "❌ FFmpeg not found" antes de procurar os originais, então "⚠ File not found" só aparece com FFmpeg instalado | `compress-videos.js:84-102` | Nenhuma, ou meia linha |
| O09 | OBSERVAÇÃO | CI-CD.md:14 | O deploy aceita o check com conclusão `success` **ou** `skipped` | `deploy.yml:26` | Precisar o texto se o job de CI ganhar condições |

---

## 6. Afirmações corretas confirmadas

| Afirmação | Onde | Como foi confirmada |
|---|---|---|
| URL de clone e branch | README:63 | Clone feito; SHA `71d104c` |
| LFS: ponteiros de ~130 bytes com `-`; `git lfs pull` resolve (`*`) | GUIA 2.1, 7.2; FASE-4 | Clone com `GIT_LFS_SKIP_SMUDGE=1`: 131–132 bytes; `oid` e `size` idênticos ao exemplo do GUIA |
| `npm ci` funciona e mostra depreciações e o resumo do audit | GUIA:64 | Execução |
| Nenhuma conta externa é necessária para rodar, testar e compilar | README:55; GUIA:34 | Execução completa sem variáveis |
| Lint com avisos e nenhum erro; avisos não reprovam | GUIA:121,361 | 0 erros, 24 avisos, saída 0 |
| `typecheck` independe do build | Implícito na ordem do CI | Passa em clone limpo: os tipos globais do Next entram pelo `import … from "next"` em `next.config.ts` e no layout |
| 7 arquivos, 31 testes, cobertura acima dos limites | ARQUITETURA:652; FASE-1 | `test:ci` |
| `FUZZ_RUNS` aumenta as iterações; variantes bash e PowerShell | CONTRIBUTING:46; GUIA:143-144 | Duração ~5× maior; 3000 iterações aprovadas |
| Encadeamento PowerShell com `$?` | GUIA:168 | Para após falha (`upload:large`), segue após sucesso |
| Build: Turbopack, "Running TypeScript", 18 páginas SSG, APIs `ƒ`, `Proxy`, aviso `baseline-browser-mapping` | ARQUITETURA §6; README:219-220; FASE-4:97; GUIA:362 | Saída do build |
| `NEXT_PUBLIC_*` embutida no build; o HTML contém `/assets/ideiaforword.mp4` | ARQUITETURA:354-375; FASE-2 §5 | `.next/server/app/en.html`; runtime com a variável não muda nem `/de/about` (gerada sob demanda) |
| Vídeos locais quebrados; imagens locais OK | README:80; ARQUITETURA:423; GUIA 7.1 | `/assets/*.mp4` 404; `/assets/compressed/*.mp4` 206; imagens 206 |
| `cp .env.example .env.local` não muda o comportamento | README:72; `.env.example`:8-9; FASE-3 §4 | Dev com a cópia: URLs locais, fallbacks nas APIs |
| Modo Cloudinary: formato das URLs, padrão `dgyueliom`, logo sempre local | ARQUITETURA §7–8; GUIA 7.1 | `next dev` com a variável; HTML |
| Todos os assets mapeados e usados existem na CDN; o esquema de `lib/assets.ts` não existe | ARQUITETURA:437,446 | 8 vídeos e 24 imagens → 206; `ideiaspace/videos/space` e `ideiaspace/images/nebulus` → 404 |
| Redirecionamento de `/` (307) por cookie, `Accept-Language` ou `en`; francês → `/en` | README:157; ARQUITETURA:128-129,199 | `curl` |
| Cabeçalho `Link` com hreflang | ARQUITETURA:133 | `curl` |
| 18 páginas `200`; `terms`, `privacy` e caminhos inexistentes `404` | ARQUITETURA §9; GUIA:359 | `curl` |
| Locale inválido: `200`, inglês, `lang` inválido, cache (`x-nextjs-cache` MISS → HIT; `s-maxage=31536000`) | ARQUITETURA:241-245,328; FASE-1 | `curl` local e **em produção** (`/fr` → 200, `lang="fr"`) |
| Cabeçalhos de segurança e cache de `/assets` | SECURITY:19-21; FASE-1 | `curl` |
| Contato: validações, mensagens em português, `405` no GET, `mailto` codificado | API_DOCUMENTATION:185-253; GUIA 7.3 | `curl` (sem chave) |
| Satélites: fallbacks por grupo, cabeçalhos, contagens 3/3/10/10, grupo desconhecido → `stations`, nenhuma chamada externa sem credenciais | API_DOCUMENTATION:60-124; GUIA 7.4 | `curl` e logs |
| `upload:large` falha com "Cannot find module" | README:117; GUIA:129,363 | Execução |
| Nomes de rota × menu (Desafio/Challenge/Desafío; Recursos/Resources) | README:131-132; ARQUITETURA:484-488 | `messages/*.json` |
| `teacher-resources` órfã, com texto fixo em português | README:133; ARQUITETURA:463 | `grep` sem links; código |
| Distribuição Server × Client (32 arquivos `'use client'`), `Footer` virando client | ARQUITETURA §5 | `grep`; leitura |
| Código não utilizado (13 módulos + `AboutCarousel`) | ARQUITETURA:673 | `grep` e **Graphify** (lista idêntica) |
| Exports de navegação do `routing.ts` não usados | ARQUITETURA:184 | `grep` |
| Conteúdo fixo no código (500/30, parceiros, líderes, CNPJ, WhatsApp) | ARQUITETURA:550-565 | Leitura |
| `services.whatIsChallenge` restaurada nos 3 idiomas | CHANGELOG:29 | `grep` |
| Repositório público; issues #3–#8 abertas com os temas do BACKLOG | SECURITY:5; CI-CD:12; BACKLOG | API do GitHub |
| A produção usa Cloudinary (variável presente no build), Vercel, região `gru1` | README:221,223; ARQUITETURA:631 | HTML e cabeçalhos de `www.ideiaspace.com.br` |
| Sem `VERCEL_TOKEN`, o deploy por Actions é pulado e o smoke test só avisa | README:222; CI-CD:20; GUIA:198-201 | Anotações da execução 37491482358 |
| Os 107 links relativos e âncoras dos documentos oficiais (e 4 dos de estudo) estão corretos | Todos | Verificador com `github-slugger` |
| 7 diagramas da ARQUITETURA e 1 da AUDITORIA são sintaticamente válidos | ARQUITETURA; AUDITORIA | `mmdc` (mermaid 11.17.2) gerou SVG sem erro |
| Nenhum segredo nos documentos; exemplos são placeholders evidentes | Todos | Varredura por padrões (`re_…`, `sk_`, `AKIA`, `ghp_`, chaves privadas, senhas) |

---

## 7. Lacunas

Itens que um desenvolvedor precisa saber e que **não estão** na documentação oficial, por prioridade:

1. **Estado real do deploy.** A Git integration da Vercel publica `main` (Production) e **toda branch** (Preview). O `deploy.yml` está inativo (sem `VERCEL_TOKEN`). O smoke test nunca valida nada (P04, P05). URL de produção: `https://www.ideiaspace.com.br`.
2. **Modo de falha real do contato** e a restrição do remetente fixo `onboarding@resend.dev` (P01, P19).
3. **Estado de segurança das dependências** (PR #1, `npm audit`) (P03).
4. **Guia de edição de conteúdo.** Como adicionar ou alterar missão, depoimento, parceiro, líder, números de impacto, links de redes sociais. A AUDITORIA:611 propunha `docs/CONTEUDO.md`/`docs/MIDIA.md` para a Fase 4, mas o GUIA entregue cobre setup, operação e deploy. Hoje a informação está espalhada: ARQUITETURA §10 (tabela de conteúdo fixo), GUIA:172 (traduções) e GUIA:151 (vídeo novo).
5. **Como adicionar uma página nova** (só há instruções para adicionar idioma).
6. **Comportamento de 404** (sem `not-found.tsx`; erro de *root layout* em dev) e o efeito do `x-default` (P10, P20).
7. **Pendências de conteúdo**: traduções vazias, namespace `teacherResources` inexistente, placeholders de parceiros e LinkedIn (P26).
8. **Versão do Node em produção** e fim de vida do Node 20 (O01).
9. **Política de manutenção da documentação**: responsável, quando atualizar CHANGELOG/BACKLOG, data de revisão. A própria API traz "Versão 1.0.0" sem critério (P32).
10. **Índice dos materiais de estudo** e aviso de que são *snapshots* (seção 9).

---

## 8. Informações que continuam incertas

### 8.1 Confirmáveis pelo repositório (resolvidas nesta revisão)

| Pergunta (de documentos anteriores) | Resposta | Evidência |
|---|---|---|
| O `typecheck` funciona sem build prévio? | Sim | Clone limpo |
| A cópia do `.env.example` muda algo? | Não | Execução |
| Fuzz com 3000 iterações passa? (FASE-1:361) | Sim | Execução |
| O teste "TLE inválido" passa pela validação de TLE? | Não (P08) | `lcov` |
| O que acontece quando o Resend falha? | `200` com sucesso falso (P01) | Simulação local |

### 8.2 Dependem do ambiente

- Execução com **Node 20**: não testada localmente. O CI de `main` (Node 20) está verde, e a última execução foi bem-sucedida em `4d8a95a`.
- **Turbopack em dev no Windows** com caminhos longos (O03). Velocidade do jsdom no Windows (GUIA:364): observada (*environment* 79 s somados na primeira execução).
- **Recarga de env no `next dev`** com Turbopack: verificada só com webpack (P12).
- Renderização das bandeiras no Windows (GUIA:360): não verificada nesta revisão (sem navegador).

### 8.3 Dependem do time

- **Fluxo de branches oficial** (`main` direto ou `dev` restaurado) e o destino da branch `dev` divergente (P02).
- **E-mails oficiais**: `admin@ideiaspace.com` (destino do formulário; o domínio `.com` só redireciona o site para `.com.br`) e `contato@ideiaspace.com.br` (SECURITY). Existem caixas nesses endereços?
- **Números de impacto oficiais** (3/1500+ em `documentacao`; 6/1600+ em `main`; "500"/"30" fixos no `StatsCarousel`).
- Consumidor de `/api/satellites`: a app externa `tleideiaspaceview.vercel.app` responde `200`, mas não se sabe se usa esta rota.
- Intenção para `teacher-resources`, `/terms`, `/privacy` e para os cards "Work in Progress".
- Se os materiais de estudo devem continuar no histórico público (O04).

### 8.4 Dependem de serviços externos

- **Vercel**: configuração de LFS no painel; versão do Node; variáveis do ambiente Preview; *Deployment Protection* dos Previews. **Resolvido:** a Git integration é o mecanismo ativo, e a produção usa Cloudinary.
- **Resend**: se a conta de produção existe, se a chave está configurada e se o remetente `onboarding@resend.dev` consegue entregar para `admin@ideiaspace.com` (o Resend limita esse remetente; conferir na documentação do provedor). Combinado com P01, uma recusa passaria despercebida.
- **Space-Track e N2YO**: comportamento real, formatos e limites (API_DOCUMENTATION:350-366); autenticação do Space-Track sem nenhum teste.
- **Cloudinary**: se novos uploads ainda geram `public_id` `ideiaspace/<nome>` (depende do modo de pastas da conta). Os assets atuais existem com esse esquema.
- **GitHub**: só a proteção clássica de branch foi conferida (`protected=false`); *rulesets* não podem ser vistos sem autenticação.

---

## 9. Qualidade pedagógica

### 9.1 Avaliação por material

| Material | Pontos fortes | Problemas | Nota |
|---|---|---|---|
| `AUDITORIA_INICIAL.md` | Marcadores ✅/⚠️/❓ separam fato de hipótese. Mapa de aprendizado em 11 etapas com "o que você deve conseguir explicar". Apêndice honesto sobre os limites do Graphify | *Snapshot* de `a71fa4c` sem aviso de validade. Origem de P01 (500) e da ideia "deploy **apenas** de `main`". Contagem de componentes errada (P30) | Boa |
| `FASE-1-VALIDACAO.md` | Registro de execução exemplar: comandos, resultados, reclassificação dos itens, "o que aprendi" | `weather` "22" (P14). "Links internos apontam para `/en`" (P13). Algumas afirmações viraram históricas (README antigo) sem marcação | Boa |
| `FASE-2-ARQUITETURA-ESTUDO.md` | A melhor progressão do conjunto: metáfora "porteiro/bibliotecário/editor", exercício com linhas exatas, roteiro de leitura em 18 passos, perguntas com respostas escondidas | P29 (dinâmico × proxy, frase desatualizada, pergunta ambígua). Não cobre os modos de falha das APIs | Muito boa |
| `FASE-3-DOCUMENTACAO-ESTUDO.md` | Ensina critério (o que vai no README × em `docs/`), o `.env.example` como contrato e o risco de `NEXT_PUBLIC_*` | P11: apresenta uma **isenção** do gitleaks como "camada extra de segurança". A resposta 5 afirma que o `vercel.json` "mostra que o deploy automático está **configurado**" (é o padrão, P04) | Boa, com uma correção de segurança |
| `FASE-4-OPERACAO-ESTUDO.md` | Distinção clara README × runbook. Mostra que os workflows só chamam scripts. Separação correta "vídeos" × "LFS" | Não cobre o deploy real (Git integration, previews, smoke test). Repete a confiança na proteção do CI (P09) | Boa |

### 9.2 Critérios do pedido

| Critério | Avaliação |
|---|---|
| Progressão de dificuldade | Boa: execução → arquitetura → documentação → operação. Cada material reaproveita o anterior |
| Ordem de leitura | **Implícita**: não há índice comum, e a ordem só aparece pelos números das fases. O mapa da AUDITORIA §14 é o melhor guia, mas aponta para etapas, não para os arquivos FASE-* |
| Teoria × código | Muito boa: referências `arquivo:linha`, exercícios de abrir arquivos lado a lado, comandos para confirmar (ex.: procurar a URL no `en.html`) |
| Precisão técnica | Boa, com exceções que **propagaram** para a documentação oficial (P01, P06, P13, P14) e uma afirmação de segurança errada (P11) |
| Perguntas e respostas | Presentes nas FASES 2, 3 e 4. Bem formuladas, mas majoritariamente de **recordação**. Faltam exercícios práticos com saída esperada ("rode X e observe Y"), exceto o exercício do §2 da FASE-2 |
| Simplificações perigosas | (a) "Com credenciais → envia; sem → `mailto`" sem o caso de falha (FASE-2 §8). (b) "O proxy grava o cookie" (FASE-1, origem de P06). (c) "`vercel.json` configura o deploy" (FASE-3, origem de P04) |
| Conceitos sem contexto | Contrato real de dependências (SDK que não lança exceção); diferença entre mock e contrato; preview deployments |
| Repetição desnecessária | `NEXT_PUBLIC_*` explicado em 4 dos 5 materiais (é central e a repetição ajuda); vídeos locais em todos |
| Presente no oficial e ausente no estudo | Modos de falha das APIs, cabeçalhos `X-Cache-Status`/`X-Data-Source` em profundidade, CI/CD e secrets, segurança (SECURITY/BACKLOG) |
| Dá para entender o projeto só com eles? | **Quase.** Arquitetura, i18n, mídia, build e testes: sim. Deploy real, falhas das APIs, segurança e edição de conteúdo: não. Para quem clonar o repositório, só a ARQUITETURA e o GUIA estarão disponíveis: FASE-3 e FASE-4 nunca foram versionadas, e as demais só existem no histórico |

### 9.3 Diagramas Mermaid (ARQUITETURA)

| Diagrama | Sintaxe | Semântica |
|---|---|---|
| 1 — Visão geral (l. 45) | ✅ | ✅ Nós e direções corretos; o consumidor de `/api/satellites` está marcado como externo e hipotético |
| 2 — Sequência de uma requisição (l. 103) | ✅ | ❌ "grava o cookie" (P06); ⚠️ rótulos `Pg→C` e `C→B` (P31) |
| 3 — i18n (l. 163) | ✅ | ✅ Todas as arestas conferem com os imports (o `i18n.ts` é carregado pelo plugin, por isso não há aresta de import no Graphify) |
| 4 — Pipeline de mídia (l. 387) | ✅ | ⚠️ Omite o upload de imagens (P31); o `public_id` depende do modo de pastas da conta (8.4) |
| 5 — Home (l. 506) | ✅ | ✅ Confere com `page.tsx`, controller e seções |
| 6 — Contato (l. 575) | ✅ | ❌ Aresta "erro do Resend → `E500`" (P01) e `E500 → F → mailto` (P07) |
| 7 — Satélites (l. 598) | ✅ | ✅ Confere com `route.ts` |

---

## 10. Qualidade operacional

| Um desenvolvedor consegue… | Resultado | Comentário |
|---|---|---|
| **Instalar** | ✅ | O README seguido literalmente funcionou no clone limpo (URL, LFS, `npm ci`). Só tropeça em Windows com caminho muito longo (O03) |
| **Executar** | ✅ | `npm run dev` e `npm start` como descritos. Vídeos ausentes e o caminho para ativá-los estão bem explicados |
| **Testar** | ✅/⚠️ | Todos os comandos funcionam (bash e PowerShell). O que os testes **garantem** está superestimado (P01, P08) |
| **Entender a arquitetura** | ✅ | ARQUITETURA sólida e confirmada; corrigir P06, P07, P13 e os diagramas 2 e 6 |
| **Editar conteúdo** | ⚠️ | Traduções: sim (paridade testada). Conteúdo fixo no código: só uma tabela de "onde está", sem passo a passo (lacuna 4) |
| **Trabalhar com mídia** | ✅/⚠️ | Pipeline bem documentado. Ressalvas: o script de favicon não funciona (P17), o upload não tem nome de conta padrão (P18) e o `public_id` de novos uploads depende da conta |
| **Entender as APIs** | ⚠️ | Contratos de sucesso e validação corretos. **Modo de falha do contato errado (P01)** e cobertura superestimada (P08) |
| **Entender o deploy** | ❌/⚠️ | O que está escrito é em parte configuração inócua (P04), o smoke test não funciona (P05), o fluxo de branches não existe (P02) e "CI obrigatório" não é aplicado (P09). O mecanismo real (Git integration + previews) não está escrito |

---

## 11. Redundâncias

| Tema | Onde aparece | Efeito observado | Fonte única sugerida (futuro) |
|---|---|---|---|
| Variáveis de ambiente | README, CONTRIBUTING, `.env.example`, GUIA §3 e §6.2, API_DOCUMENTATION, ARQUITETURA §7, CI-CD | Pequenas divergências (P18) | `.env.example` (detalhe) + README (tabela curta) |
| `NEXT_PUBLIC_*` no build e no dev | README, CONTRIBUTING, `.env.example`, ARQUITETURA §7 e §14, GUIA (4×), CI-CD | P12 replicado em 6 arquivos | ARQUITETURA §7 |
| Vídeos locais | README, CONTRIBUTING, `.env.example`, ARQUITETURA §8 e §14, GUIA 7.1 | Consistentes | GUIA 7.1 + ARQUITETURA §8 |
| Fluxo de branches | README, CONTRIBUTING, GUIA §5 e §6.1 | P02 replicado em 3 arquivos | CONTRIBUTING |
| Deploy e Vercel | README, CI-CD, GUIA §6, ARQUITETURA §12 | P04 replicado em 4 arquivos | CI-CD (ou GUIA §6) |
| Sequência de verificação pré-PR | README, CONTRIBUTING, GUIA, template de PR | Consistente | Template de PR + CONTRIBUTING |
| Contrato das APIs | API_DOCUMENTATION, ARQUITETURA §11, README, GUIA 7.3-7.4 | P01 replicado em 3 arquivos | API_DOCUMENTATION |
| Rotas e menu | README, ARQUITETURA §9 | Consistente | ARQUITETURA §9 |
| Árvore de diretórios | README, CONTRIBUTING (AUDITORIA) | Pequena divergência (P28) | README |
| Corrigidos no PR de CI | CHANGELOG, BACKLOG | Duplicado | CHANGELOG |

A redundância não está errada em si, mas **multiplicou cada erro**: nenhum dos problemas P01, P02, P04 e P12 aparece em um só lugar.

---

## 12. Recomendações

### Antes da Fase 5

Correções documentais pequenas (estimativa: 1 a 2 horas) e necessárias para que o ponto de partida da Fase 5 seja correto:

1. **P01**: reescrever o modo de falha do contato em `API_DOCUMENTATION.md` (respostas, modos de operação, Estado de Verificação), `docs/ARQUITETURA.md` §11 (texto e diagrama) e `docs/GUIA_OPERACIONAL.md` §7.3. Marcar como defeito conhecido.
2. **P02 + P09**: decidir o fluxo de branches e ajustar `CONTRIBUTING.md`, `README.md` e `docs/GUIA_OPERACIONAL.md` §5/§6.1, inclusive a palavra "obrigatório".
3. **P03**: registrar o PR #1 e o resultado do `npm audit` no `docs/BACKLOG.md` e no `SECURITY.md`. São a entrada natural da Fase 5.
4. **P04 + P05**: descrever o deploy real (Git integration, previews, `deploy.yml` inativo, smoke test inócuo) em `docs/CI-CD.md`, `docs/GUIA_OPERACIONAL.md` §6 e `README.md`.
5. Recomendado na mesma passada: **P06** (cookie), **P07** (formulário em 500) e **P08** (cobertura dos testes de satélites).

### Durante a Fase 5

Itens em que o código e a documentação devem mudar juntos:

- Tratar o `error` do Resend e corrigir o teste para o contrato real do SDK (P01).
- Atualizar dependências e decidir o PR #1 (P03); avaliar a migração do Node 20 (O01).
- `vercel.json`: remover `git.lfs` (ou configurar o LFS no painel) e decidir sobre previews (P04). Corrigir o smoke test (P05).
- Validar o locale (`hasLocale`/`notFound`, derivar o `matcher` do `routing.ts`), tratar o `x-default` (P10, P13), criar `not-found.tsx` e o layout raiz (P20).
- Restringir a allowlist do gitleaks (P11). Proteção de branch, se o time quiser "CI obrigatório" (P09).
- Conteúdo: traduções vazias, namespace `teacherResources`, placeholders (P26); `generate-favicon.js` e o padrão do script de upload (P17, P18).
- Transformar o §14 da ARQUITETURA e as lacunas deste laudo em issues, para que o BACKLOG passe a ser a lista completa de dívida técnica.

### Depois da Fase 5

- Consolidar as redundâncias da seção 11, com uma fonte única por tema e links a partir das demais.
- Criar o guia de edição de conteúdo e o de "nova página" (lacunas 4 e 5).
- Definir a manutenção da documentação: responsável, atualização do CHANGELOG a cada PR, data de revisão.
- Automatizar o que esta revisão fez à mão: verificação de links e âncoras e validação de Mermaid no CI.
- Organizar os materiais de estudo: índice com ordem de leitura, aviso de *snapshot* em cada um e correção de P11, P29 e P30.

---

## 13. Veredito

| Pergunta | Resposta |
|---|---|
| **A documentação está pronta para ser considerada consistente?** | **Ainda não.** É majoritariamente correta e verificável (seção 6), mas tem um erro crítico de comportamento (P01) e contradições de processo (P02, P09) que a tornam inconsistente com o repositório e com a operação real. |
| **Existem correções obrigatórias?** | **Sim:** P01 (crítico), P02 e P03 (altos). P04 e P05 são fortemente recomendadas, porque descrevem o deploy de forma enganosa. |
| **A Fase 5 pode começar?** | **Sim, depois das correções obrigatórias**, que são só edições de texto. Alternativa aceitável: abrir a Fase 5 com P01–P03 como primeira entrega, corrigindo documento e código no mesmo PR, e só então seguir para o restante da dívida técnica. |
| **Algum documento precisa ser revisado antes?** | `API_DOCUMENTATION.md` (P01, P07, P08), `docs/GUIA_OPERACIONAL.md` (P01, P02, P04, P05, P08), `docs/ARQUITETURA.md` (P01, P06, P07 e diagramas 2 e 6), `CONTRIBUTING.md` e `README.md` (P02, P04, P09), `docs/BACKLOG.md` e `SECURITY.md` (P03). |

---

## Anexo — Evidências de execução (resumo)

```text
# Falha do Resend simulada sem serviço externo (servidor de produção do clone)
RESEND_API_KEY=re_fake RESEND_BASE_URL=http://127.0.0.1:9 next start
POST /api/contact {válido} → 200 {"success":true,"message":"Mensagem enviada com sucesso! Entraremos em contato em breve."}
log: Email sent successfully: undefined
# Mesmo resultado com stub local respondendo 403 (validation_error) em POST /emails

# Cookie de idioma (next start)
GET /pt  Accept-Language: pt-BR  → 200, sem Set-Cookie
GET /pt  Accept-Language: en-US  → 200, Set-Cookie: NEXT_LOCALE=pt; Path=/; SameSite=lax

# Locale inválido e x-default (produção)
Link de /pt/about: <https://www.ideiaspace.com.br/about>; rel="alternate"; hreflang="x-default"
GET https://www.ideiaspace.com.br/about → 200, <html lang="about">, h1 "Welcome to Ideia Space"

# Smoke test (deploy.yml) — execução 37491482358
::notice::VERCEL_TOKEN ausente — a Git integration da Vercel já publica em push para main. Pulando.
::warning::https://ideiaspace.com.br não respondeu 200
https://ideiaspace.com.br → 307 https://www.ideiaspace.com.br/ → 307 /en

# Schema oficial do vercel.json
git.properties = deploymentEnabled, exclusivity, skipUnaffectedProjects   (0 ocorrências de "lfs")

# Cobertura de src/app/api/satellites/route.ts — linhas nunca executadas
168-169, 176-210 (Space-Track), 264-269, 322-337 (TLE inválido/STALE), 358-368 (STALE no catch)

# Branches (git e API do GitHub)
origin/dev...origin/main = 1 / 12 · PR #2 → main · PR #9 → main · main protected=false
```
