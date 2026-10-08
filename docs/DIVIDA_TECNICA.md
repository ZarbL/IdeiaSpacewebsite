# Dívida Técnica

> Registro dos problemas técnicos que existem no projeto, com prioridade, evidência e decisões pendentes. Estado verificado em **08/10/2026** na branch `documentacao` (commit `71d104c`, mais as correções do saneamento pré-Fase 5, ainda sem commit) e comparado com `main` (`4d8a95a`, em produção) e `dev` (`e80cf1e`). Evidências com data podem mudar: confira de novo antes de agir.

---

## 1. Objetivo

Este documento responde a uma pergunta: **quais problemas técnicos ainda existem no projeto, qual a importância de cada um e o que precisa ser decidido ou desenvolvido.**

Para cada problema, ele registra:

- o que acontece e onde;
- o impacto;
- a severidade e a prioridade;
- a evidência que comprova que o problema existe;
- os problemas relacionados e as decisões de que a solução depende.

Ele não corrige nada. Também lista o que já foi resolvido e o que foi analisado e descartado, para que esses itens não voltem a ser tratados como pendências.

Os outros documentos têm papéis diferentes:

- [`docs/BACKLOG.md`](BACKLOG.md) é o índice das issues do GitHub, onde o trabalho é acompanhado (ver a [seção 9](#9-relação-com-o-backlog-atual)).
- O [§14 da ARQUITETURA](ARQUITETURA.md#14-limites-e-pontos-conhecidos) explica os limites do sistema para quem vai mexer no código. Este registro diz o que fazer com eles e em que ordem.

### Como manter

- Ao resolver um item, mova-o para a [seção 7](#7-itens-resolvidos) com o PR que o resolveu. Não apague o histórico.
- Antes de planejar um ciclo, repita a verificação dos itens P0 e P1. A verificação do `npm audit` e as consultas a produção e ao GitHub mudam com o tempo.
- Um problema novo só entra com evidência (arquivo e linha, comando ou comportamento observado).

---

## 2. Como interpretar

### Estados

| Estado | Significado | Onde aparece |
|---|---|---|
| **Pendente** | O problema existe no estado atual e foi comprovado | Seções 3 a 5 |
| **Decisão pendente** | Só pode ser resolvido depois de uma decisão do time; desenvolvimento sozinho não resolve | Seção 6 |
| **Resolvido** | Existia e deixou de existir | Seção 7 |
| **Descartado** | Foi analisado e não é dívida técnica: comportamento esperado, limitação do ambiente ou assunto fora do produto | Seção 8 |
| **Incerto** | Não há evidência suficiente para classificar | Seção 10 |

### Severidade

Mede o **dano quando o problema se manifesta**. Não considera a probabilidade nem o custo de corrigir.

| Severidade | Critério |
|---|---|
| **Crítica** | Pode comprometer o servidor ou os dados, ou fazer o site perder informação de visitantes sem que ninguém perceba |
| **Alta** | Quebra ou engana o visitante numa função importante, como o contato, ou expõe a um risco de segurança relevante |
| **Média** | Afeta parte dos visitantes ou do time e tem contorno; ou é um risco de segurança que depende de outras condições |
| **Baixa** | Inconsistência, incômodo ou custo de manutenção, sem efeito relevante para o visitante |

### Prioridade

Indica **quando tratar**. Combina severidade, probabilidade, exposição em produção, custo da correção e dependências.

| Prioridade | Quando |
|---|---|
| **P0 — imediata** | Risco possível ou ativo em produção, ou pré-requisito direto de um item assim. Tratar antes de qualquer outra entrega |
| **P1 — alta** | Entra no próximo ciclo de desenvolvimento |
| **P2 — planejável** | Entra no planejamento quando houver espaço. Vários dependem de uma decisão |
| **P3 — baixa** | Melhoria oportunista: fazer quando mexer no código próximo |

**Severidade não é prioridade.** Três exemplos deste registro:

- **DT-018** (`dangerouslySetInnerHTML`): severidade **Média**, porque poderia virar XSS. Prioridade **P3**, porque hoje o conteúdo vem só de arquivos versionados.
- **DT-009** (página 404 sem layout): severidade **Baixa**. Prioridade **P2**, porque os links do rodapé levam visitantes até ela em todas as páginas e a correção é pequena.
- **DT-003** (branch `dev` desatualizada): severidade **Média**. Prioridade **P0**, porque pelo fluxo do time nenhuma correção chega à produção sem passar por `dev`.

### Tipos

| Tipo | Usado para |
|---|---|
| Segurança | Vulnerabilidades, cabeçalhos de proteção, abuso de rotas |
| Bug funcional | Comportamento errado que o visitante percebe |
| Internacionalização | Idiomas, textos fora das traduções, `lang`, `hreflang` |
| Conteúdo / Dados | Conteúdo ausente, provisório ou desatualizado |
| Mídia / Assets | Vídeos, imagens e scripts de mídia |
| Arquitetura | Estrutura que não combina com o ambiente de execução |
| Testes | Comportamentos sem verificação automatizada |
| Infraestrutura / Deploy | Node, CI/CD, Vercel, branches |
| Manutenibilidade | Custo de mudar o código com segurança |
| Código legado | Código e dependências sem uso |
| Performance | Peso e velocidade das páginas |
| Documentação | Afirmações erradas ou ausentes nos documentos oficiais |

### Origem dos itens

Cada ficha traz a própria evidência e não depende de outros documentos. A linha "Origem" aponta de onde o item veio:

- **A1–A18 e D1–D14**: auditoria inicial, um documento local de estudo, fora do Git.
- **P01–P32 e O01–O09**: laudo [`docs/REVISAO-FINAL-DOCUMENTACAO.md`](REVISAO-FINAL-DOCUMENTACAO.md).
- **#n**: issues do GitHub.

---

## 3. Resumo executivo

| ID | Tipo | Severidade | Prioridade | Estado | Resumo |
|---|---|---|---|---|---|
| [DT-001](#dt-001--vulnerabilidades-nas-dependências-de-produção) | Segurança | Crítica | P0 | Pendente | `next` 16.0.8 e outras 10 dependências de produção com vulnerabilidades conhecidas, duas críticas de execução remota de código |
| [DT-002](#dt-002--o-envio-do-formulário-de-contato-pode-falhar-sem-aviso) | Bug funcional | Crítica | P0 | Pendente | O e-mail do contato usa o remetente de teste do Resend; em produção, uma recusa ainda aparece como sucesso |
| [DT-003](#dt-003--branch-dev-desatualizada-em-relação-a-main) | Infraestrutura / Deploy | Média | P0 | Pendente | `dev` está 12 commits atrás de `main`, sem CI, e todo PR para ela tem conflito em `package-lock.json` |
| [DT-004](#dt-004--o-fallback-mailto-do-formulário-não-é-confiável) | Bug funcional | Alta | P1 | Pendente | No erro 500 o `mailto:` não abre; sem chave, o formulário confirma "Mensagem recebida!" e apaga os campos |
| [DT-005](#dt-005--qualquer-primeiro-segmento-da-url-é-tratado-como-idioma) | Internacionalização | Média | P1 | Pendente | `/about`, `/fr` ou `/wp-login.php` respondem 200 com a Home e `lang` inválido; o `x-default` aponta para essas URLs |
| [DT-006](#dt-006--node-20-em-fim-de-vida) | Infraestrutura / Deploy | Média | P1 | Pendente | O projeto e as actions do CI usam Node 20, sem suporte desde 30/04/2026 |
| [DT-007](#dt-007--textos-e-metadados-fora-das-traduções) | Internacionalização | Média | P2 | Pendente | Mensagens da API, rótulos, `alt` e metadados iguais nos três idiomas |
| [DT-008](#dt-008--links-para-páginas-inexistentes-e-conteúdo-provisório) | Conteúdo / Dados | Média | P2 | Pendente | Rodapé com `/terms`, `/privacy` (404) e links `#`; parceiros genéricos; traduções vazias; página órfã |
| [DT-009](#dt-009--página-404-sem-o-layout-do-site) | Bug funcional | Baixa | P2 | Pendente | O 404 é a página padrão do Next, sem cabeçalho, rodapé nem `<html>` do site |
| [DT-010](#dt-010--vídeos-não-carregam-em-builds-sem-cloudinary) | Mídia / Assets | Média | P2 | Pendente | Sem `NEXT_PUBLIC_USE_CLOUDINARY=true` no build, nenhum vídeo carrega |
| [DT-011](#dt-011--api-de-satélites-cache-por-instância-login-a-cada-busca-e-chave-aberta) | Arquitetura | Média | P2 | Pendente | Cache só por instância, login no Space-Track a cada busca e `groups` livre como chave do cache |
| [DT-012](#dt-012--apicontact-sem-limite-de-requisições) | Segurança | Média | P2 | Pendente | O formulário de contato aceita requisições sem limite |
| [DT-013](#dt-013--política-de-segurança-de-conteúdo-mínima) | Segurança | Média | P2 | Pendente | A CSP é só `frame-ancestors *`: qualquer site pode embutir o site |
| [DT-014](#dt-014--lacunas-de-testes) | Testes | Média | P2 | Pendente | Sem testes de componente nem E2E; `STALE`, TLE inválido, Space-Track e validação de tamanho nunca executam |
| [DT-015](#dt-015--deploy-verificações-e-configurações-sem-efeito) | Infraestrutura / Deploy | Baixa | P2 | Pendente | O smoke test nunca recebe 200; o `vercel.json` tem chaves sem efeito |
| [DT-016](#dt-016--documentação-com-afirmações-inexatas) | Documentação | Média | P2 | Pendente | 26 inexatidões do laudo continuam nos documentos oficiais |
| [DT-017](#dt-017--ferramentas-de-desenvolvimento-vulneráveis-ou-defasadas) | Segurança | Baixa | P2 | Pendente | Vitest 2 com aviso crítico (correção só no major 4); `eslint-config-next` e `baseline-browser-mapping` defasados |
| [DT-018](#dt-018--dangerouslysetinnerhtml-alimentado-por-traduções) | Segurança | Média | P3 | Pendente | Seis pontos renderizam HTML cru vindo das traduções |
| [DT-019](#dt-019--código-componentes-e-dependências-sem-uso) | Código legado | Baixa | P3 | Pendente | 13 módulos sem importador, exports e campos sem uso, 4 dependências não importadas |
| [DT-020](#dt-020--scripts-de-mídia-quebrados-ou-dependentes-de-arquivos-ausentes) | Mídia / Assets | Baixa | P3 | Pendente | `upload:large` sem arquivo, favicon sem `icon.svg`, nome errado no upload |
| [DT-021](#dt-021--conteúdo-fixo-no-código-e-cache-imutável-de-assets) | Manutenibilidade | Baixa | P3 | Pendente | Equipe, parceiros e números nos componentes; `/assets/*` com cache imutável de 1 ano |
| [DT-022](#dt-022--peso-das-páginas) | Performance | Baixa | P3 | Pendente | 11 `<img>` sem `next/image`; o JSON completo do idioma vai em toda página |
| [DT-023](#dt-023--avisos-de-lint-tipagem-any-e-pequenos-defeitos) | Manutenibilidade | Baixa | P3 | Pendente | 24 avisos de lint permanentes, `any` em 3 pontos, `console.log` duplicado |
| [DT-024](#dt-024--a-varredura-de-segredos-ignora-arquivos-example) | Segurança | Baixa | P3 | Pendente | O gitleaks não verifica o `.env.example` |

**Totais:** 24 itens pendentes (3 P0, 3 P1, 11 P2, 7 P3) e 9 decisões pendentes ([seção 6](#6-decisões-pendentes)). Por severidade: 2 críticos, 1 alto, 12 médios e 9 baixos.

---

## 4. Dívidas técnicas

### DT-001 — Vulnerabilidades nas dependências de produção

**Tipo:** Segurança
**Severidade:** Crítica
**Prioridade:** P0
**Estado:** Pendente

**Problema**

O `next` instalado (16.0.8, dependência direta) tem 40 avisos de segurança publicados. Dois são críticos, de execução remota de código (RCE). Outras 10 dependências de produção também têm avisos. Já existem versões corrigidas, mas nenhuma foi aplicada.

**Impacto**

O site público roda sobre o framework vulnerável. Os avisos críticos são:

- [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36): RCE sem autenticação em servidores hospedados no Windows;
- [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4): RCE na API de otimização de imagens quando há arquivos AVIF. O `next.config.ts:14` habilita AVIF.

Há ainda 15 avisos altos no `next`. A aplicabilidade de cada aviso à hospedagem na Vercel não foi avaliada ([seção 10](#10-limitações)).

**Evidência**

- `npm audit --omit=dev` (08/10/2026): 11 pacotes de produção afetados.
  - 1 crítico: `next`, direto.
  - 6 altos: `lodash`, `lodash-es`, `nanoid`, `postcss`, `sharp`, `source-map-js`, todos indiretos.
  - 4 moderados: `next-intl` e `resend`, diretos; `svix` e `uuid`, indiretos.
  - Todos com correção publicada (`fixAvailable`).
- Avisos do `next`: 40 (2 críticos, 15 altos, 19 moderados, 4 baixos). Os críticos valem para `>=16.0.0 <16.3.3`; o conjunto todo deixa de se aplicar a partir da 16.3.8.
- `package-lock.json`: `next` 16.0.8.
- O job "npm audit (advisory)" do `security.yml` terminou com sucesso na execução 37491482373 (06/10/2026): ele é informativo e não bloqueia.

**Contexto técnico**

Origem: laudo P03 (falta de registro, resolvida no saneamento).

O PR #1, aberto pelo `vercel[bot]` em 11/12/2025, leva o `next` a 16.0.7 para corrigir outra falha (GHSA-9qr9-h5gf-34mp). Essa falha já está corrigida desde o commit `bc4f0da`. Mesclar o PR hoje gera conflito e rebaixaria o `next`.

Detalhes e histórico em [`docs/BACKLOG.md`](BACKLOG.md#segurança-das-dependências-sem-issue-aberta).

**Possível direção de solução**

1. Atualizar o `next` dentro da linha 16 (16.3.8 ou posterior) e os moderados diretos.
2. Regenerar o lockfile.
3. Repetir lint, typecheck, testes e build, e conferir as páginas manualmente: não há testes E2E (DT-014).
4. Fechar o PR #1.

**Dependências**

- Pelo fluxo do time, a correção chega à produção por `dev`, que precisa ser sincronizada antes (DT-003).
- Combina com DT-006 (Node) e DT-017 (ferramentas de desenvolvimento).

**Issue relacionada:** nenhuma. Registrado no BACKLOG, sem issue. PR #1 superado.

---

### DT-002 — O envio do formulário de contato pode falhar sem aviso

**Tipo:** Bug funcional
**Severidade:** Crítica
**Prioridade:** P0
**Estado:** Pendente

**Problema**

O e-mail do formulário sai com remetente fixo `onboarding@resend.dev` para o destinatário fixo `admin@ideiaspace.com` (`src/app/api/contact/route.ts:103-104`). Segundo a documentação do Resend, o domínio `resend.dev` serve só para testes e só entrega para o e-mail do dono da conta. Para qualquer outro destinatário, a API responde `403`. Se `admin@ideiaspace.com` não for o dono da conta do Resend, nenhum envio funciona.

Em produção (`main`), essa falha é invisível. A rota ainda não tem a correção do P01 e responde `200` "Mensagem enviada com sucesso!" quando o Resend recusa o envio. A correção existe só nesta branch, sem commit.

**Impacto**

Se a configuração estiver errada, todas as mensagens de contato se perdem, e nem o visitante nem a empresa percebem. Não se sabe se isso está acontecendo. Depende de a `RESEND_API_KEY` estar configurada na Vercel e de qual é o e-mail da conta do Resend ([seção 10](#10-limitações)). Sem a chave, o site usa o fallback `mailto:` (DT-004).

**Evidência**

- `route.ts:103-104`: remetente e destinatário fixos.
- Documentação do Resend, ["403 Error Using resend.dev Domain"](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain): o domínio de teste só envia para o endereço da conta; outros destinatários recebem `403`.
- Reprodução do saneamento ([`docs/PRE-F5-SANEAMENTO.md`](PRE-F5-SANEAMENTO.md#2-p01--falha-do-resend-tratada-como-sucesso)): com o código de `71d104c`, uma recusa `403` simulada gerou `200` com sucesso e o log `Email sent successfully: undefined`.
- `git diff HEAD...origin/main` não altera `src/app/api/contact/route.ts`. Portanto, produção roda esse mesmo código.

**Contexto técnico**

Origem: auditoria D4; laudo P01 e P19.

O SDK do Resend (v6) não lança exceção quando o envio é recusado; ele devolve `{ data: null, error }`. A correção do P01 trata esse `error` e responde `500`, mas só passa a valer depois de publicada.

**Possível direção de solução**

1. Conferir na Vercel se a `RESEND_API_KEY` existe em Production e, no Resend, qual é o e-mail da conta e se há domínio verificado. Não exige código.
2. Publicar a correção do P01 pelo fluxo do time.
3. Usar um remetente de domínio verificado, definido por variável de ambiente.

**Dependências**

- DEC-01 (domínio e e-mails oficiais).
- DT-003, para publicar a correção.
- Acesso aos painéis da Vercel e do Resend.

**Issue relacionada:** nenhuma.

---

### DT-003 — Branch `dev` desatualizada em relação a `main`

**Tipo:** Infraestrutura / Deploy
**Severidade:** Média
**Prioridade:** P0
**Estado:** Pendente

**Problema**

Pelo fluxo do time ([`CONTRIBUTING.md`](../CONTRIBUTING.md#fluxo)), toda mudança passa por `dev` antes de chegar a `main`. Hoje `dev` está 12 commits atrás de `main` e tem 1 commit próprio (`e80cf1e`, satélite 3D no Hero, de 08/09/2026). Ela não tem a pasta `.github/` (nenhum workflow), os testes nem a documentação atual.

**Impacto**

- Todo PR de uma branch nova para `dev` traz junto os 12 commits de `main` e tem conflito em `package-lock.json`.
- Até `dev` receber o conteúdo de `main`, um push direto nela não roda o CI.
- As correções P0 (DT-001 e DT-002) não chegam à produção pelo fluxo enquanto isso não for resolvido.

**Evidência**

- `git rev-list --left-right --count origin/dev...origin/main` → `1 12` (08/10/2026).
- `git ls-tree -r origin/dev -- .github` não lista nada, e `origin/dev` não tem nenhum arquivo em `__tests__`.
- `git merge-tree --write-tree origin/dev origin/main`, num clone temporário: `CONFLICT (content): Merge conflict in package-lock.json`. Os demais arquivos se mesclam sem conflito. O resultado é o mesmo com `origin/documentacao`.
- API pública do GitHub: nenhum PR teve `dev` como base.

**Contexto técnico**

Origem: laudo P02 e O02; saneamento.

O commit `e80cf1e` adiciona `@react-three/fiber` e `@react-three/drei` ao `package.json` e importa `three`. Por isso o lockfile diverge.

**Possível direção de solução**

Levar o conteúdo de `main` para `dev`, resolvendo o conflito do `package-lock.json`, e conferir se o CI passa a rodar em `dev`.

**Dependências**

- Ação do time, com permissão de escrita no repositório.
- Relacionado: DEC-08 (proteção das branches) e DEC-09 (destino do satélite 3D).

**Issue relacionada:** nenhuma.

---

### DT-004 — O fallback `mailto:` do formulário não é confiável

**Tipo:** Bug funcional
**Severidade:** Alta
**Prioridade:** P1
**Estado:** Pendente

**Problema**

O `ContactForm` só abre o cliente de e-mail quando a resposta é `200` (`src/components/ContactForm.tsx:46-55`). Isso gera dois casos:

1. **Erro 500** (envio recusado ou exceção). O formulário mostra "Erro ao enviar mensagem. Abrindo cliente de email...", mas nada é aberto (`ContactForm.tsx:67-72`). O `mailtoLink` dessa resposta nem tem assunto ou corpo (`route.ts:35`).
2. **Sem `RESEND_API_KEY`**. A API responde `200` com "Mensagem recebida! Abrindo cliente de email..." (`route.ts:86-95`). O formulário mostra isso como sucesso, aponta `window.location.href` para o `mailto:` e apaga os campos 3 segundos depois (`ContactForm.tsx:53-66`). Se o visitante não tiver um cliente de e-mail configurado, nada é enviado e o texto se perde.

**Impacto**

- No modo sem chave, o visitante lê "Mensagem recebida!" sem que nada tenha sido recebido.
- No erro 500, a promessa de abrir o e-mail não se cumpre. Os campos continuam preenchidos, e é possível tentar de novo.
- Com a correção do P01 publicada, o caso 1 passa a ser o comportamento de qualquer falha do Resend.

**Evidência**

- Código citado acima.
- Build de produção servido localmente, sem chave (08/10/2026): `POST /api/contact` → `200 {"success":true,"message":"Mensagem recebida! Abrindo cliente de email...","useMailto":true,...}`.
- Não há teste de componente para o `ContactForm` (DT-014). O comportamento no navegador foi avaliado pelo código.

**Contexto técnico**

Origem: laudo P07; issue #8 (item `ContactForm.tsx`).

A documentação ainda afirma que o formulário abre o `mailto:` sempre que a resposta traz `useMailto` (`API_DOCUMENTATION.md:421`; DT-016).

**Possível direção de solução**

- Tratar `useMailto` também nas respostas de erro.
- Mostrar o link ou um botão, em vez de navegar automaticamente.
- Não chamar de "recebida" uma mensagem que não foi enviada, e só limpar os campos depois de um envio confirmado.
- Passar as mensagens pelas traduções (DT-007).

**Dependências**

DT-002: se a produção não tiver `RESEND_API_KEY`, o caso 2 é o comportamento real do site, e a prioridade sobe para P0.

**Issue relacionada:** #8 (parcial).

---

### DT-005 — Qualquer primeiro segmento da URL é tratado como idioma

**Tipo:** Internacionalização
**Severidade:** Média
**Prioridade:** P1
**Estado:** Pendente

**Problema**

Se o primeiro segmento da URL não for `en`, `pt` ou `es`, o site responde `200` com a Home em inglês e `<html lang="<segmento>">`, e a página fica em cache. Isso inclui URLs sem prefixo, como `/about`, e caminhos arbitrários, como `/wp-login.php`.

O cabeçalho `Link` de cada página anuncia justamente a URL sem prefixo como `x-default`.

**Impacto**

- Os buscadores recebem, como `x-default` de cada página, uma URL que entrega a Home em inglês com `lang` inválido. Em produção, `/about` é a Home.
- Qualquer caminho inexistente fora de `/en`, `/pt` e `/es` vira uma página `200` (*soft 404*) guardada em cache, inclusive sondagens automáticas.
- Nessas páginas, o seletor de idioma não funciona: ele troca `/${locale}` na URL, e `/about` não contém `/en` (`Header.tsx:14,18-20`, pela leitura do código).
- O link para Recursos herda o segmento inválido (`/fr/technologies`).

**Evidência**

- Produção (08/10/2026):
  - o `Link` de `/pt/about` contém `<https://www.ideiaspace.com.br/about>; rel="alternate"; hreflang="x-default"`;
  - `GET https://www.ideiaspace.com.br/about` → `200`, `<html lang="about">`, h1 "Welcome to Ideia Space".
- Build de produção servido localmente:
  - `/fr`, `/about` e `/wp-login.php` → `200`, com `lang` igual ao segmento e `x-nextjs-cache: HIT`;
  - `/fr` contém `href="/fr/technologies"` e `href="/en/technologies"`.
- Código:
  - `src/proxy.ts:8`: locales escritos à mão no `matcher`;
  - `src/app/[locale]/layout.tsx:55-63`: usa o segmento sem validar e não chama `notFound()`;
  - `src/i18n.ts:9-11`: cai para `en`;
  - `src/views/sections/TechnologiesSection.tsx:8-9,32`: usa `useParams`.

**Contexto técnico**

Origem: auditoria A15; laudo P10 e P13.

O idioma é resolvido em três lugares, com regras diferentes ([ARQUITETURA §4](ARQUITETURA.md#o-locale-é-tratado-em-mais-de-um-ponto)). O `matcher` do proxy não casa `/fr` nem `/about`, então essas URLs vão direto para a rota `[locale]`, que aceita qualquer valor. A página é gerada sob demanda e guardada em cache.

**Possível direção de solução**

- Validar o locale no layout (`hasLocale` + `notFound()`) ou limitar os parâmetros à lista do `routing.ts`.
- Derivar o `matcher` dessa lista.
- Revisar a configuração do `x-default` no next-intl.

**Dependências**

- DT-009, para que o 404 resultante tenha o layout do site.
- Afeta DT-008: os links sem prefixo dos cards de Recursos.

**Issue relacionada:** nenhuma.

---

### DT-006 — Node 20 em fim de vida

**Tipo:** Infraestrutura / Deploy
**Severidade:** Média
**Prioridade:** P1
**Estado:** Pendente

**Problema**

O projeto fixa Node 20 no `.nvmrc`. Essa versão está sem suporte desde 30/04/2026, e o CI a usa (`node-version-file: .nvmrc`). O `package.json` não declara `engines`, então a versão de produção é a configurada no painel da Vercel, que não está registrada em lugar nenhum.

Há também um problema separado. As actions `actions/checkout@v4`, `actions/setup-node@v4` e `actions/upload-artifact@v4` usam o runtime Node 20, que o GitHub descontinuou e já executa à força em Node 24.

**Impacto**

- O CI, e possivelmente a produção, rodam num runtime sem correções de segurança.
- Testes e build são validados numa versão que pode não ser a usada pela Vercel.
- As actions continuam funcionando, mas por uma compatibilidade forçada.

**Evidência**

- `.nvmrc` = `20`; `ci.yml` usa `node-version-file: .nvmrc`; `package.json` sem `engines`; `@types/node` `^20`.
- Calendário oficial do Node.js ([`nodejs/Release`](https://github.com/nodejs/Release/blob/main/schedule.json)):

  | Versão | Fim do suporte |
  |---|---|
  | 20 | 30/04/2026 |
  | 22 | 30/04/2027 |
  | 24 | 30/04/2028 |

- Anotação nas execuções de 06/10/2026 (CI 37491482368, Deploy 37491482358, Security 37491482373): "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4, actions/upload-artifact@v4".

**Contexto técnico**

Origem: laudo O01.

O laudo citou essa anotação como evidência do fim de vida do Node do projeto, mas ela trata do runtime das actions. São dois problemas distintos. Ficam juntos aqui porque têm a mesma origem (Node 20).

As mesmas execuções avisam que o rótulo `ubuntu-latest` passa para o Ubuntu 26 a partir de 19/10/2026.

**Possível direção de solução**

- Escolher a versão-alvo (22 ou 24).
- Atualizar `.nvmrc`, `@types/node` e o runtime no painel da Vercel, e declarar `engines`.
- Atualizar as actions para versões que usam Node 24.
- Validar com o CI completo.

**Dependências**

- Acesso ao painel da Vercel.
- Combina com DT-001 e DT-017.

**Issue relacionada:** nenhuma.

---

### DT-007 — Textos e metadados fora das traduções

**Tipo:** Internacionalização
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

Parte dos textos não passa pelo `next-intl` e aparece igual nos três idiomas:

- respostas da API de contato e mensagens do formulário, em português (`route.ts:33,49,58,68,89,204`; `ContactForm.tsx:49,70,77`);
- "Work in Progress" e "Saiba Mais" nos cards de Recursos (`ResourceCard.tsx:31,42`);
- "Idioma / Language" no menu do celular (`Header.tsx:221`);
- a página `teacher-resources`, em português fixo (`teacher-resources/page.tsx:27,30`);
- `alt` e `aria-label` fixos, em português ou inglês (ex.: `BenefitsCarousel.tsx:12`, `StatsCarousel.tsx:93,102`, `PhasesCarousel.tsx:54,61`);
- título, descrição e OpenGraph do site, em inglês para todos os idiomas (`src/app/[locale]/layout.tsx:25-42`).

**Impacto**

- Visitantes em inglês e espanhol veem mensagens em português no formulário e nos cards.
- Buscadores e redes sociais recebem título e descrição em inglês nas páginas em português e espanhol.
- Leitores de tela leem rótulos em outro idioma.

**Evidência**

Build de produção servido localmente (08/10/2026):

- `/en/technologies` contém "Saiba Mais" 9 vezes e "Work in Progress" 9 vezes;
- `/en/teacher-resources` mostra "Recursos para Professores";
- `/es` tem `og:title` "IdeiaSpace - Space Technology";
- `/pt` tem a `description` em inglês;
- `POST /api/contact` responde em português, qualquer que seja o idioma da página.

**Contexto técnico**

Origem: auditoria A7 e A9.

Os metadados são um objeto estático no layout de idioma. Não há `generateMetadata` por locale.

**Possível direção de solução**

- Mover os textos para `messages/*.json`. A API pode devolver um código e deixar o texto para o componente.
- Gerar os metadados por idioma.

**Dependências**

- Revisão de conteúdo nos três idiomas.
- Relacionado: DT-004 (mensagens do formulário) e DT-008 (`teacher-resources`).

**Issue relacionada:** nenhuma.

---

### DT-008 — Links para páginas inexistentes e conteúdo provisório

**Tipo:** Conteúdo / Dados
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

- O rodapé linka `/{locale}/terms` e `/{locale}/privacy`, que não existem (`Footer.tsx:82-86`), e tem LinkedIn e Facebook com `href="#"` (`Footer.tsx:63,68`). O rodapé aparece em todas as páginas, menos em `/missions`.
- Os 4 líderes da página Sobre têm LinkedIn `"#"`, numa lista duplicada para celular e desktop (`about/page.tsx:115-195`).
- 6 dos 9 parceiros se chamam "Partner 4" a "Partner 9" (`PartnersCarousel.tsx:12-17`).
- Há traduções vazias:
  - `hero.subtitle` e `missions.hero.subtitle`, nos três idiomas;
  - `services.spaceChallenge.description`, em `en` e `pt`, por isso o hero de `/services` aparece sem descrição nesses idiomas;
  - `services.spaceChallenge.button`, em `pt`.
- A página `/{locale}/teacher-resources` não é linkada em lugar nenhum e pede o namespace `teacherResources`, que não existe (`teacher-resources/page.tsx:9`).
- Os 9 cards de Recursos estão como "Work in Progress". As props `link` apontam para rotas que não existem e não têm prefixo de idioma: `/edusat`, `/orbital`, `/methodology`, `/training` e `/constellation` (`technologies/page.tsx:62-102`). Hoje elas não são usadas. Se os cards forem ativados, os links cairão no problema de DT-005.

**Impacto**

- Links quebrados e placeholders prejudicam a credibilidade do site institucional.
- O formulário coleta nome e e-mail, mas não há página de privacidade publicada: o link leva a um 404.

**Evidência**

- Build de produção servido localmente: `/pt/terms` e `/pt/privacy` → `404`; a Home tem 2 `href="#"`.
- Contagem por script dos valores vazios em `messages/*.json`.
- O teste de paridade tolera valores vazios (`messages-parity.test.ts:43-44`).

**Contexto técnico**

Origem: auditoria A6, A7 e A8; laudo P26; issue #8 (traduções vazias).

O CHANGELOG afirma "placeholders removidos" (DT-016).

**Possível direção de solução**

Para cada caso, publicar o conteúdo real ou remover o link ou o elemento. Decidir o destino da página `teacher-resources`.

**Dependências**

- DEC-06 (páginas legais e conteúdo provisório).
- DT-009 (404 com layout) reduz o dano enquanto isso não for resolvido.

**Issue relacionada:** #8 (parcial: traduções vazias).

---

### DT-009 — Página 404 sem o layout do site

**Tipo:** Bug funcional
**Severidade:** Baixa
**Prioridade:** P2
**Estado:** Pendente

**Problema**

O layout raiz só repassa os filhos (`src/app/layout.tsx:1-7`), e não existe `not-found.tsx`. Um 404 mostra a página padrão do Next, sem o `<html>` do site, sem cabeçalho, sem rodapé e sem idioma. No `next dev`, o mesmo caso exibe o erro "Missing `<html>` and `<body>` tags in the root layout".

**Impacto**

- O visitante que cai num 404 fica sem navegação, por exemplo ao clicar em "Terms" ou "Privacy" no rodapé (DT-008).
- Em desenvolvimento, o erro parece problema de setup.

**Evidência**

- Build de produção servido localmente (08/10/2026): `/pt/naoexiste`, `/pt/terms` e `/pt/privacy` → `404`, nenhum `<html`, título "404: This page could not be found.".
- `find src/app -name 'not-found*'` não encontra nenhum arquivo.
- Erro do `next dev` registrado no laudo (P20).

**Contexto técnico**

Origem: laudo P20.

Como o `<html>` só existe no layout de idioma, um 404 sem segmento válido não tem onde se apoiar.

**Possível direção de solução**

Criar um `not-found.tsx` dentro de `[locale]` e um 404 raiz com `<html>`, seguindo o padrão do next-intl.

**Dependências**

Combina com DT-005: validar o locale passa a gerar 404.

**Issue relacionada:** nenhuma.

---

### DT-010 — Vídeos não carregam em builds sem Cloudinary

**Tipo:** Mídia / Assets
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

Sem `NEXT_PUBLIC_USE_CLOUDINARY=true` no build, as URLs de vídeo apontam para `/assets/<nome>.mp4` (`src/lib/cloudinary.ts:105-109`). Os arquivos, porém, estão em `public/assets/compressed/`, e nenhum vídeo carrega.

Os 13 `.mp4` versionados com Git LFS não são usados pelo site em nenhum dos dois modos.

**Impacto**

- Produção não é afetada: a variável está definida na Vercel, e os vídeos vêm do Cloudinary.
- São afetados o desenvolvimento local, o artefato do CI e qualquer ambiente sem a variável, possivelmente os Previews ([seção 10](#10-limitações)).
- O CI não detecta o problema: o build passa e nenhum teste abre o site.

**Evidência**

- Build de produção servido localmente, sem variáveis:
  - `/assets/ideiaforword.mp4` → `404`;
  - `/assets/compressed/ideiaforword.mp4` → `206`;
  - o HTML de `/en` contém `/assets/ideiaforword.mp4`, `/assets/desafioespacial.mp4` e `/assets/emblema.mp4`.
- Produção: o hero usa `https://res.cloudinary.com/dgyueliom/video/upload/q_auto:eco,f_auto/ideiaspace/ideiaforword`.

**Contexto técnico**

Origem: auditoria A1, confirmado na Fase 1.

O valor da variável fica gravado no HTML durante o build ([ARQUITETURA §7](ARQUITETURA.md#7-variáveis-next_public_)). Os testes de `cloudinary.ts` verificam a URL gerada, não se o arquivo existe.

**Possível direção de solução**

Fazer o modo local apontar para `compressed/`, ou mover os arquivos. Decidir se os `.mp4` continuam no repositório.

**Dependências**

Nenhuma decisão de negócio. Afeta os scripts de mídia (DT-020).

**Issue relacionada:** nenhuma.

---

### DT-011 — API de satélites: cache por instância, login a cada busca e chave aberta

**Tipo:** Arquitetura
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

Com credenciais configuradas, `GET /api/satellites` tem quatro problemas:

- **Cache por instância.** O cache é um objeto do módulo (`route.ts:13-14`) e só vale dentro de uma instância da função serverless.
- **Login a cada busca.** A rota faz login no Space-Track (`POST /ajaxauth/login`) a cada busca não cacheada (`route.ts:182-188`). Não reaproveita a sessão nem evita logins concorrentes.
- **Chave do cache aberta.** A chave é o valor bruto de `groups` (`route.ts:214,244,340`). Um grupo desconhecido busca os IDs de `stations` (`route.ts:258`) e grava uma entrada nova. Assim, cada valor diferente de `groups` dispara uma nova busca na N2YO: 3 requisições, com 100 ms entre elas.
- **Cabeçalho errado no HIT.** Todo HIT devolve `X-Data-Source: n2yo` (`route.ts:251`), inclusive no grupo `ideiaspace`, que vem do Space-Track.

**Impacto**

- Instâncias frias repetem buscas e logins.
- O Space-Track pune logins repetidos. A issue #5 relata que esse padrão já bloqueou a conta em outro projeto do time.
- Qualquer pessoa pode gastar a cota da chave N2YO e multiplicar as invocações variando `groups`.
- O cabeçalho informa a origem errada.

Sem credenciais, nada disso acontece: a rota devolve o fallback antes de qualquer busca. Não se sabe se a produção tem credenciais nem quem consome a rota ([seção 10](#10-limitações)).

**Evidência**

- Código citado acima.
- Build de produção servido localmente, sem credenciais: `groups=stations`, `ideiaspace`, `stations,starlink` e `xyz` → `X-Cache-Status: FALLBACK`.
- Cobertura dos testes (08/10/2026): o caminho do Space-Track (`route.ts:176-210` e `264-269`) nunca é executado.

**Contexto técnico**

Origem: auditoria A3 e A4; laudo O05; issues #5 e #8.

Nenhum código do repositório chama essa rota. O item "Nossos Satélites" do menu leva a uma aplicação externa.

**Possível direção de solução**

Depende da DEC-03. Se a rota continuar:

- validar `groups` contra a lista de grupos;
- usar um cache compartilhado (o cache de `fetch` do Next ou um armazenamento externo);
- tirar o login do Space-Track do caminho da requisição;
- corrigir o cabeçalho.

**Dependências**

- DEC-03 (consumidor e futuro da rota) e DEC-05 (dados de fallback).
- Credenciais de teste para validar.

**Issue relacionada:** #5; #8 (cabeçalho do HIT e dados inline).

---

### DT-012 — `/api/contact` sem limite de requisições

**Tipo:** Segurança
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

A rota não limita requisições por origem nem tem proteção contra robôs, como honeypot ou captcha. A validação dos campos impede conteúdo inválido, mas não volume.

**Impacto**

Com o Resend funcionando, um script pode encher a caixa `admin@ideiaspace.com` e consumir a cota do Resend. Sem a chave, o abuso só gera respostas `mailto:`.

**Evidência**

`src/app/api/contact/route.ts` não lê o IP nem guarda estado entre requisições (leitura integral do arquivo). O `package.json` não tem dependência de rate limiting.

**Contexto técnico**

Origem: issue #3, ainda correta.

Em serverless, um limite em memória não vale entre instâncias.

**Possível direção de solução**

A proposta da issue #3: limite por IP num armazenamento compartilhado e, como primeira barreira, honeypot e tempo mínimo de preenchimento.

**Dependências**

- DT-002: o impacto é maior se o envio real estiver ativo.
- Pode exigir um serviço externo, como Redis gerenciado.

**Issue relacionada:** #3.

---

### DT-013 — Política de segurança de conteúdo mínima

**Tipo:** Segurança
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

A única diretiva de CSP é `frame-ancestors *` (`next.config.ts:41-42`), que permite a qualquer site embutir este num iframe (clickjacking). Não há `X-Frame-Options` nem regras de CSP para scripts, estilos, imagens e conexões.

**Impacto**

- Sem CSP, uma falha de injeção de HTML (DT-018) teria efeito pleno.
- O clickjacking tem alcance limitado num site institucional, mas o formulário de contato pode ser sobreposto por outra página.

**Evidência**

Produção (08/10/2026): `Content-Security-Policy: frame-ancestors *;` e nenhum `X-Frame-Options`. O build local responde igual.

**Contexto técnico**

Origem: issue #4. A diretiva veio do commit `a303076` ("iframe liberado", 19/05/2026), que trocou `X-Frame-Options: SAMEORIGIN` por `frame-ancestors *`.

A issue está **parcialmente desatualizada**:

- cita Three.js, react-globe.gl e workers do globo, que o código não usa (o 3D da branch `dev` pode mudar isso; DEC-09);
- propõe `connect-src` para a N2YO e o Space-Track, que são chamados pelo servidor, não pelo navegador.

**Possível direção de solução**

- Restringir `frame-ancestors` aos domínios que de fato embutem o site, ou a `'self'`.
- Introduzir uma CSP completa, primeiro em modo *report-only*.

**Dependências**

- DEC-07 (quem embute o site).
- DEC-09 (o 3D pode exigir WebGL e workers).

**Issue relacionada:** #4.

---

### DT-014 — Lacunas de testes

**Tipo:** Testes
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

- Não há testes de componente, de página nem end-to-end. O `ContactForm`, a troca de idioma e o carregamento de mídia não têm verificação automatizada.
- Na API de satélites, três caminhos nunca executam: o login e a consulta ao Space-Track, a rejeição de TLE inválido (`isValidTLE`) e os dois caminhos `STALE`. O teste "resposta HTML da API → TLE inválido" chega ao fallback por outro ramo ("Nenhum TLE recebido").
- Na API de contato, nenhum teste rejeita um campo pelo tipo ou pelo tamanho (`route.ts:55-62`).
- O teste de paridade das traduções conta cada array como uma chave, aceita valores vazios e não verifica se as chaves usadas no código existem.
- O build do CI roda sem Cloudinary, então nenhum check vê os vídeos (DT-010).

**Impacto**

Regressões de interface e de integração passam pelo CI. Isso já aconteceu duas vezes, com o CI verde:

- os vídeos locais quebrados (A1);
- a falha do Resend tratada como sucesso (P01).

**Evidência**

- Relatório de cobertura (`lcov`) do `npm run test:ci` sobre o código atual (08/10/2026):
  - `satellites/route.ts`: 78,23% das linhas; nunca executam as linhas 157, 168-169, 176-210, 264-269, 323-337 e 360-368;
  - `contact/route.ts`: as linhas 57-61 nunca executam.
- `satellites.test.ts:67-74`.
- `messages-parity.test.ts:8-14`.

**Contexto técnico**

Origem: auditoria §10; laudo P08 e P16; issue #7.

A issue #7 está **parcialmente desatualizada**:

- espera um globo (`<canvas>`) na página de missões, que não existe;
- diz que o `Header` usa a navegação do next-intl, mas ele usa `next/navigation`;
- cita o `AboutCarousel`, que não é renderizado.

A documentação afirma que `STALE` e TLE inválido estão cobertos (DT-016).

**Possível direção de solução**

Começar pelos casos de maior risco:

- `ContactForm`: sucesso, erro e `mailto:`;
- `STALE` e TLE inválido;
- rejeição por tipo e por tamanho no contato;
- um teste de fumaça E2E nas páginas principais.

**Dependências**

- DT-004: definir o comportamento correto do formulário antes de testá-lo.
- Um ambiente para os testes E2E, como o Preview da Vercel.

**Issue relacionada:** #7.

---

### DT-015 — Deploy: verificações e configurações sem efeito

**Tipo:** Infraestrutura / Deploy
**Severidade:** Baixa
**Prioridade:** P2
**Estado:** Pendente

**Problema**

- **Smoke test.** O teste do `deploy.yml` faz `curl` sem seguir redirecionamentos (`deploy.yml:50-56`). A URL padrão responde `307`, então ele nunca recebe `200`. Só registra um aviso, e o job termina com sucesso.
- **Deploy pela Vercel CLI.** Essa etapa (`deploy.yml:40-46`) é pulada porque não há `VERCEL_TOKEN`. Quem publica é a integração Git da Vercel.
- **Check de CI.** O job de espera aceita o check de CI com conclusão `skipped` (`deploy.yml:26`).
- **`vercel.json`.** A chave `git.lfs` (`vercel.json:12`) não existe no schema oficial. `deploymentEnabled.main: true` (`vercel.json:9-11`) repete o padrão e não restringe nada: toda branch gera um deploy de Preview.

**Impacto**

- O único teste pós-deploy não detecta um site fora do ar.
- A configuração sugere controles que não existem (LFS, deploy só de `main`), e a documentação os descreve como ativos (DT-016).

**Evidência**

- Produção (08/10/2026): `https://ideiaspace.com.br` → `307` → `https://www.ideiaspace.com.br/` → `307` → `/en`.
- Execução Deploy 37491482358 (06/10/2026), concluída com `success`, com duas anotações:
  - "VERCEL_TOKEN ausente — a Git integration da Vercel já publica em push para main. Pulando.";
  - "https://ideiaspace.com.br não respondeu 200".
- Schema [`openapi.vercel.sh/vercel.json`](https://openapi.vercel.sh/vercel.json) (08/10/2026):
  - `git` aceita só `deploymentEnabled`, `exclusivity` e `skipUnaffectedProjects`;
  - nenhuma ocorrência de `lfs`;
  - sobre `deploymentEnabled`: "Any non specified branch is `true` by default".
- API de deployments do GitHub: há Previews das branches `documentacao` e `dev` (laudo, P04).

**Contexto técnico**

Origem: laudo P04, P05 e O09.

Há dois caminhos de deploy configurados, mas só a integração Git está ativa.

**Possível direção de solução**

Decidir o mecanismo de deploy (DEC-04). Se o `deploy.yml` continuar:

- seguir os redirecionamentos ou testar a URL final;
- falhar o job quando o site não responder.

Em qualquer caso, tirar do `vercel.json` as chaves sem efeito e configurar no painel o que for necessário.

**Dependências**

DEC-04 e acesso ao painel da Vercel.

**Issue relacionada:** nenhuma.

---

### DT-016 — Documentação com afirmações inexatas

**Tipo:** Documentação
**Severidade:** Média
**Prioridade:** P2
**Estado:** Pendente

**Problema**

O laudo apontou 32 problemas na documentação. O saneamento corrigiu P01 a P03, e P09 em parte. Os demais continuam no texto (conferidos por `grep` em 08/10/2026). Os que mais afetam a operação:

| Laudo | Onde (linhas atuais) | O que está errado |
|---|---|---|
| P04 | `README.md:221`; `docs/ARQUITETURA.md:632,634`; `docs/GUIA_OPERACIONAL.md:193-194`; `docs/CI-CD.md:3-4,20` | Descrevem `git.lfs` e `deploymentEnabled` como configurações ativas (DT-015) |
| P05 | `README.md:222`; `docs/CI-CD.md:14`; `docs/GUIA_OPERACIONAL.md`, §6.1 | Apresentam o smoke test como verificação, mas ele nunca recebe `200` |
| P07 | `API_DOCUMENTATION.md:421`; `docs/ARQUITETURA.md:588,591` | Dizem que o formulário abre o `mailto:` sempre que vem `useMailto` (DT-004) |
| P08 | `docs/GUIA_OPERACIONAL.md:347`; `docs/ARQUITETURA.md:648`; `CHANGELOG.md:14` | Dizem que `STALE` e TLE inválido são cobertos pelos testes (DT-014) |
| P06 | `docs/ARQUITETURA.md:113,133,199`; `docs/GUIA_OPERACIONAL.md:357` | Dizem que o proxy grava o cookie `NEXT_LOCALE` em toda página; ele só grava em certas condições |
| P20 | `docs/ARQUITETURA.md:247`; `docs/GUIA_OPERACIONAL.md:359` | Tratam o 404 como normal, mas ele não tem o layout do site (DT-009) |

Outros, de menor impacto:

- **P12**: recarga do `.env.local` no `next dev`.
- **P13**: consequências de um locale inválido (`docs/ARQUITETURA.md:242,244`).
- **P14**: o grupo `weather` tem 21 IDs, não 22 (`API_DOCUMENTATION.md:122`).
- **P15**: o fallback não é um subconjunto de cada grupo (`API_DOCUMENTATION.md:115`).
- **P16**: são 198 chaves por idioma, não 204 (`docs/ARQUITETURA.md:187`).
- **P17**: o script de favicon aparece como funcional (`README.md:182`; `docs/ARQUITETURA.md:91`).
- **P18**: o script de upload não tem *cloud name* padrão (`README.md:91`).
- **P19**: o troubleshooting manda verificar o domínio, mas o remetente é fixo (`API_DOCUMENTATION.md:345,488`).
- **P21**: lista de segredos incompleta (`SECURITY.md:16-18`).
- **P22**: o CHANGELOG não tem as entradas de documentação.
- **P23**: comando do fnm e do Volta (`docs/GUIA_OPERACIONAL.md:30`).
- **P24, P25, P28 e P31**: simplificações e omissões menores.
- **P26**: "placeholders removidos" (`CHANGELOG.md:35`).
- **P27**: "Three-Line" × "Two-Line" e timeout global (`API_DOCUMENTATION.md:15,18,111`).
- **P32**: "Versão: 1.0.0" sem critério (`API_DOCUMENTATION.md:511`).

Também faltam:

- um guia de edição de conteúdo;
- um guia para criar uma página nova;
- a descrição do deploy real (integração Git e Previews por branch);
- uma regra de manutenção da documentação.

**Impacto**

Quem opera o projeto acredita em controles de deploy e em cobertura de testes que não existem, e procura o problema no lugar errado.

**Evidência**

As evidências de cada item estão no laudo ([seção 5](REVISAO-FINAL-DOCUMENTACAO.md#5-problemas-encontrados)). A presença de cada afirmação no texto atual foi conferida por `grep`.

**Contexto técnico**

A redundância entre documentos multiplica cada erro ([laudo, seção 11](REVISAO-FINAL-DOCUMENTACAO.md#11-redundâncias)).

**Possível direção de solução**

- Corrigir cada afirmação junto com o código do item relacionado (DT-004, DT-009, DT-014 e DT-015).
- Corrigir as demais numa revisão de texto.
- Eleger uma fonte única por tema.

**Dependências**

Algumas correções dependem da DEC-01 (e-mails) e da DEC-04 (deploy).

**Issue relacionada:** nenhuma.

---

### DT-017 — Ferramentas de desenvolvimento vulneráveis ou defasadas

**Tipo:** Segurança
**Severidade:** Baixa
**Prioridade:** P2
**Estado:** Pendente

**Problema**

Contando também as dependências de desenvolvimento, o `npm audit` aponta 39 pacotes (4 críticos, 24 altos, 10 moderados, 1 baixo).

- Além do `next`, há aviso crítico no `vitest` 2.1.9 e no `@vitest/coverage-v8`: leitura e execução de arquivos quando o servidor da interface do Vitest está ativo. A correção só existe na versão 4 (mudança de major).
- O `eslint-config-next` está fixo em 16.0.3, diferente do `next` 16.0.8.
- O `baseline-browser-mapping` desatualizado gera um aviso a cada build.

**Impacto**

- O risco fica restrito às máquinas de desenvolvimento e ao CI. O projeto não usa a interface do Vitest (`--ui`).
- A atualização do Vitest para a versão 4 pode exigir mudanças na configuração dos testes.

**Evidência**

- `npm audit` (08/10/2026):
  - `vitest` e `@vitest/coverage-v8` com aviso crítico, corrigido em `vitest@4.1.11` (major);
  - `tinypool` com aviso crítico;
  - `eslint-config-next` com aviso alto.
- O `next start` exibe "[baseline-browser-mapping] The data in this module is over two months old".
- O `npm ci` lista pacotes depreciados: `glob@10`, `q` e `whatwg-encoding`.

**Contexto técnico**

Origem: Fase 1 (problemas encontrados 6, 8 e 9); laudo P03.

**Possível direção de solução**

- Planejar a migração do Vitest 2 para o 4, com a revisão da configuração.
- Alinhar o `eslint-config-next` à versão do `next`.
- Atualizar o `baseline-browser-mapping`.

**Dependências**

Fazer depois de DT-001, porque o `eslint-config-next` acompanha o `next`.

**Issue relacionada:** nenhuma.

---

### DT-018 — `dangerouslySetInnerHTML` alimentado por traduções

**Tipo:** Segurança
**Severidade:** Média
**Prioridade:** P3
**Estado:** Pendente

**Problema**

Seis pontos renderizam HTML cru vindo das traduções:

- `about/page.tsx:62` e `:81`;
- `MissionBadges.tsx:60`, com um conversor próprio de `**negrito**` e quebras de linha;
- `ChallengeSection.tsx:32`;
- `IdeiaToSpaceSection.tsx:59`;
- `TechnologiesSection.tsx:29`.

**Impacto**

Hoje o conteúdo vem de arquivos versionados e revisados, então o risco é baixo. Se essas strings passarem a vir de uma fonte externa (um CMS ou um painel), o problema vira XSS armazenado. Quem edita essas chaves, na prática, edita HTML.

**Evidência**

`grep -rn dangerouslySetInnerHTML src` → 6 ocorrências (08/10/2026), as mesmas da issue #6.

**Contexto técnico**

Origem: auditoria A10; laudo P25; issue #6, ainda atual. A issue exagera ao chamar o `wordpress.ts` de "meio conectado": o módulo não é importado.

Sem CSP (DT-013), não há uma segunda barreira.

**Possível direção de solução**

Usar `t.rich()` do next-intl para negrito e quebras de linha, eliminando o HTML cru.

**Dependências**

Mudança coordenada nas traduções dos três idiomas.

**Issue relacionada:** #6.

---

### DT-019 — Código, componentes e dependências sem uso

**Tipo:** Código legado
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

- **13 módulos sem nenhum importador**: `AnimatedPattern`, `CloudinaryVideo`, `EcosystemCard`, `ImpactCards`, `ImpactCarousel`, `InfoCard`, `JourneyCard`, `SlowVideo`, `TechnologyCard`, `WhatsAppButton`, `CTASection`, `lib/assets.ts` e `lib/wordpress.ts`. O `lib/assets.ts` usa outro esquema de `public_id`, que não existe no Cloudinary.
- **Importações sem uso**: `AboutCarousel`, `LeadershipCard`, `getVideoUrl`, `Link` e parâmetros não usados (9 avisos `no-unused-vars` do lint).
- **Exports sem uso**: `routing.ts:14-15` exporta `Link`, `redirect`, `usePathname` e `useRouter`, e ninguém os importa.
- **Campos que nenhuma seção exibe**: o controller monta `subtitle`, `buttonText`, `buttonLink` e `aboutButton` do hero, e o bloco `cta` inteiro (`home.controller.ts:11-15,33-37`).
- **Dependências não importadas**: `react-globe.gl`, `satellite.js`, `next-cloudinary` e `three`. O `cloudinary` (SDK) está em `dependencies`, mas só o script de upload o usa.
- **Restos do template do Next**: as variáveis `--font-geist-*` (`globals.css:31-32`) e 5 SVGs em `public/` sem referência.

**Impacto**

Mais código para ler e manter, instalação maior e superfície maior no `npm audit`. O README antigo chegou a apresentar componentes mortos como funcionalidades.

**Evidência**

- Busca de importadores por nome de arquivo, e de dependências em `src/` e `scripts/` (08/10/2026).
- Lint: 9 avisos `no-unused-vars`.
- Cobertura de 0% em `lib/assets.ts` e `lib/wordpress.ts`.
- A lista coincide com a do Graphify, usado na auditoria.

**Contexto técnico**

Origem: auditoria §6.5, A2, A12, A14 e A16; issue #8 (`wordpress.ts`).

A branch `dev` (`e80cf1e`) importa `three` por meio do `@react-three/fiber`. Remover `three` agora conflitaria com esse trabalho.

**Possível direção de solução**

Remover o que não tem uso confirmado, em PRs pequenos, e mover o `cloudinary` para `devDependencies`.

**Dependências**

- DEC-09 (satélite 3D de `dev`), para decidir sobre `three`.
- DEC-03 (API de satélites), para decidir sobre `satellite.js`.

**Issue relacionada:** #8 (parcial: `wordpress.ts`).

---

### DT-020 — Scripts de mídia quebrados ou dependentes de arquivos ausentes

**Tipo:** Mídia / Assets
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

- `npm run upload:large` aponta para `scripts/upload-large-videos.js`, que não existe.
- `scripts/generate-favicon.js` lê `src/app/icon.svg`, que não existe, e usa `sharp`, que não está declarado no `package.json` (`generate-favicon.js:1,5`).
- `scripts/upload-to-cloudinary.js:37` lista `MissionProgrammingTool.png`, mas o arquivo real é `missionprogrammintool.png`.
- O script de upload lê o *cloud name* só da variável de ambiente (`upload-to-cloudinary.js:8`), sem o valor padrão que o site usa.
- `compress-videos.js` espera os vídeos originais em `public/assets/*.mp4`, e não há nenhum no repositório.

**Impacto**

Quem precisar atualizar a mídia encontra comandos que falham ou fazem menos do que prometem.

**Evidência**

- `ls scripts` mostra 3 arquivos, sem `upload-large-videos.js`.
- `ls src/app` não tem `icon.svg`.
- `ls public/assets` tem `missionprogrammintool.png` e nenhum `.mp4` na raiz.
- `npm run upload:large` falhou com `MODULE_NOT_FOUND` na validação do laudo.

**Contexto técnico**

Origem: auditoria §8 (tabela de scripts); laudo P17 e P18.

**Possível direção de solução**

- Remover o script npm órfão.
- Corrigir ou remover o gerador de favicon.
- Alinhar a lista de upload aos nomes reais.
- Documentar onde ficam os vídeos originais.

**Dependências**

- DT-010 (decisão sobre os vídeos no repositório).
- Credenciais do Cloudinary para validar o upload.

**Issue relacionada:** nenhuma.

---

### DT-021 — Conteúdo fixo no código e cache imutável de `/assets`

**Tipo:** Manutenibilidade
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

- **Conteúdo nos componentes.** Parte do conteúdo está nos componentes, e não em `messages/`:
  - os líderes, numa lista duplicada para celular e desktop (`about/page.tsx:115-195`);
  - os parceiros (`PartnersCarousel.tsx`);
  - os números "500" e "30" (`StatsCarousel.tsx:16,20`);
  - redes sociais, WhatsApp, CNPJ e links do menu.
- **Cache de `/assets`.** Os arquivos de `/assets/*` são servidos com `Cache-Control: public, max-age=31536000, immutable` (`next.config.ts:55-60` e `vercel.json`), mas os nomes não têm hash.

**Impacto**

- Alterar conteúdo exige mexer em código, às vezes em dois lugares.
- Uma imagem substituída com o mesmo nome pode continuar desatualizada por até um ano no navegador de quem já visitou o site.

**Evidência**

- Leitura do código.
- O cabeçalho foi conferido no build servido localmente (`/assets/contador.jpg`).
- A [ARQUITETURA §10](ARQUITETURA.md#conteúdo-definido-diretamente-nos-componentes-todo-o-site) lista o conteúdo fixo.

**Contexto técnico**

Origem: ARQUITETURA §10 e §14.

**Possível direção de solução**

- Mover o conteúdo para as traduções ou para um arquivo de dados único.
- Ao substituir uma imagem, trocar o nome do arquivo ou servi-la pelo Cloudinary, que versiona.

**Dependências**

DEC-02 (números oficiais).

**Issue relacionada:** nenhuma.

---

### DT-022 — Peso das páginas

**Tipo:** Performance
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

- **11 `<img>` sem `next/image`** (lint `@next/next/no-img-element`): `BenefitsCarousel` (2), `HistoryCarousel` (2), `MVVCarousel` (2), `InfoCard`, `PartnersCarousel`, `ResourceCard`, `StatsCounter` e `IdeiaToSpaceSection`.
- **Traduções completas em cada página.** O layout entrega ao `NextIntlClientProvider` o JSON completo do idioma, com 22 a 25 KB, em todas as páginas, inclusive textos de outras páginas.

**Impacto**

As imagens não usam tamanhos responsivos nem formatos modernos, e o HTML fica maior que o necessário (a Home tem 63 KB). Isso afeta o LCP e o consumo de banda, principalmente no celular.

**Evidência**

- Lint (08/10/2026).
- Tamanho de `messages/*.json`: 22.579 bytes (`en`), 23.956 (`pt`) e 24.994 (`es`).
- O HTML de `/en` contém a chave `testimonials`, usada só em `/services`.

**Contexto técnico**

Origem: auditoria D13; observações da Fase 1; issue #8 (`<img>`).

A menção da issue ao `MethodologyCarousel` está desatualizada: ele já usa `next/image`. O `InfoCard` não é usado (DT-019).

**Possível direção de solução**

- Trocar as `<img>` usadas por `next/image`.
- Passar ao provider só os namespaces de que cada página precisa.

**Dependências**

Nenhuma.

**Issue relacionada:** #8 (parcial).

---

### DT-023 — Avisos de lint, tipagem `any` e pequenos defeitos

**Tipo:** Manutenibilidade
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

- O lint termina com 0 erros e 24 avisos, que não reprovam o CI. Com avisos permanentes, um aviso novo passa despercebido.
- `any` em três pontos: `home.controller.ts:7` (`t: any`), `i18n.ts:9` (`locale as any`) e `TechnologiesSection.tsx:7`.
- Aviso `react-hooks/exhaustive-deps` em `StatsCarousel.tsx:35`.
- Dois `console.log` colados na mesma linha (`satellites/route.ts:346`).
- O comentário de `vitest.setup.ts:9` diz que o `ScrollIndicator` usa `IntersectionObserver`, mas ele não usa.

**Impacto**

Pequeno: esses pontos ficam sem verificação de tipos, e a saída do lint tem ruído.

**Evidência**

`npx eslint .` (08/10/2026): 0 erros e 24 avisos (11 `no-img-element`, 9 `no-unused-vars`, 3 `no-explicit-any`, 1 `exhaustive-deps`). Os 11 primeiros estão em DT-022, e os 9 seguintes, em DT-019.

**Contexto técnico**

Origem: auditoria A17; laudo P24; issue #8 (tipagem e `console.log`).

**Possível direção de solução**

Tipar com os tipos do next-intl e corrigir os avisos. Quando chegarem a zero, tratar avisos como erro no CI.

**Dependências**

DT-019 e DT-022 eliminam 20 dos 24 avisos.

**Issue relacionada:** #8 (parcial).

---

### DT-024 — A varredura de segredos ignora arquivos `.example`

**Tipo:** Segurança
**Severidade:** Baixa
**Prioridade:** P3
**Estado:** Pendente

**Problema**

A allowlist do gitleaks exclui da varredura todo arquivo terminado em `.example` (`.gitleaks.toml:11`). Por isso, o `.env.example`, que é versionado, não é verificado.

**Impacto**

Um segredo real colado por engano no `.env.example` não seria detectado pelo CI.

**Evidência**

`.gitleaks.toml:6-12`; `git ls-files` inclui o `.env.example`.

**Contexto técnico**

Origem: laudo P11. Um material de estudo apresentava essa allowlist como "camada extra de segurança", mas ela faz o contrário.

**Possível direção de solução**

Tirar o `.example` da allowlist, ou restringir a isenção a linhas `VAR=` sem valor.

**Dependências**

Nenhuma.

**Issue relacionada:** nenhuma.

---

## 5. Dívidas por prioridade

### P0 — risco imediato

| Item | Por que é P0 |
|---|---|
| DT-002 | O primeiro passo, conferir a Vercel e o Resend, leva minutos e não exige código. Se a configuração estiver errada, as mensagens de contato estão se perdendo hoje |
| DT-001 | O framework do site público tem dois avisos críticos de RCE, e a correção já foi publicada pelo mantenedor |
| DT-003 | Pré-requisito: pelo fluxo do time, as correções de DT-001 e DT-002 só chegam à produção por `dev` |

Ordem sugerida:

1. Verificar a configuração do Resend (DT-002, passo 1).
2. Sincronizar `dev` com `main` (DT-003).
3. Publicar a correção do P01 e atualizar as dependências (DT-002 e DT-001).

### P1 — próximo ciclo

| Item | Motivo |
|---|---|
| DT-004 | O fallback do formulário engana o visitante. Sobe para P0 se a produção não tiver `RESEND_API_KEY` |
| DT-005 | Afeta o `hreflang` de todas as páginas em produção, e a correção é pequena |
| DT-006 | Runtime sem suporte no CI e, talvez, em produção |

### P2 — planejáveis

| Item | Observação |
|---|---|
| DT-007 | Textos e metadados fora das traduções |
| DT-008 | Depende da DEC-06 |
| DT-009 | Fazer junto com DT-005 |
| DT-010 | Melhora o desenvolvimento local e os Previews |
| DT-011 | Depende da DEC-03; sobe para P1 se a produção tiver credenciais |
| DT-012 | Depende de DT-002 |
| DT-013 | Depende da DEC-07 |
| DT-014 | Começar pelos casos de DT-004 e da API de satélites |
| DT-015 | Depende da DEC-04 |
| DT-016 | Corrigir junto com os itens de código relacionados |
| DT-017 | Fazer depois de DT-001 |

### P3 — baixa prioridade

DT-018 (`dangerouslySetInnerHTML`), DT-019 (código sem uso), DT-020 (scripts de mídia), DT-021 (conteúdo fixo e cache), DT-022 (peso das páginas), DT-023 (lint e tipagem) e DT-024 (gitleaks).

---

## 6. Decisões pendentes

Assuntos que o desenvolvimento não resolve sozinho. Nenhum deles é um bug: cada um precisa de uma resposta do time antes que os itens afetados possam ser concluídos.

### DEC-01 — Domínio e e-mails oficiais

- **Decisão:** quais domínio e endereços o projeto usa: destino do formulário, remetente do e-mail, contato de segurança e URL do smoke test.
- **Por que o código não decide:** o repositório usa quatro variantes.
  - O formulário envia para `admin@ideiaspace.com` (`route.ts:35,91,104`).
  - O `SECURITY.md:7` indica `contato@ideiaspace.com.br`.
  - O site responde em `www.ideiaspace.com.br`, e `ideiaspace.com` redireciona para ele (`302`).
  - O smoke test usa `https://ideiaspace.com.br`.

  Não se sabe quais caixas de e-mail existem.
- **Afeta:** DT-002 (remetente de domínio verificado), DT-015 (URL do smoke test), DT-016 (P21) e o `SECURITY.md`.

### DEC-02 — Números oficiais de impacto

- **Decisão:** quais números o site publica e onde eles ficam.
- **Por que o código não decide:**
  - A Home em `main` (produção) mostra 6 satélites, 1600+ estudantes e 5 países (PR #9, 06/10/2026). Esta branch ainda tem 3 e 1500+, e recebe os valores de `main` no merge.
  - O `StatsCarousel` de `/services` fixa no código "500 Alunos Iniciais" e "30 Alunos Selecionados" (`StatsCarousel.tsx:16,20`).
  - O `ImpactCarousel`, que não é usado, tem "+1.000", "+140", "+8" e "5+".

  Só o time sabe quais valores são atuais.
- **Afeta:** `messages/*.json`, DT-021 e DT-019 (`ImpactCarousel`).

### DEC-03 — Futuro da API de satélites

- **Decisão:** quem consome `/api/satellites` e se a rota continua neste projeto.
- **Por que o código não decide:** nenhum código do repositório chama a rota. O menu "Nossos Satélites" leva a `https://tleideiaspaceview.vercel.app`, uma aplicação externa. Não se sabe se ela usa esta rota nem se a produção tem credenciais da N2YO e do Space-Track.
- **Afeta:** DT-011 (corrigir ou remover), DT-019 (`satellite.js`), DT-014 (testes do Space-Track) e o `API_DOCUMENTATION.md`.

### DEC-04 — Mecanismo de deploy

- **Decisão:** publicar só pela integração Git da Vercel ou também pelo `deploy.yml` (Vercel CLI).
- **Por que o código não decide:** os dois caminhos estão configurados. Hoje só a integração Git publica. O `deploy.yml` pula a publicação por falta de `VERCEL_TOKEN`, mas continua rodando um smoke test sem efeito. Ter o token e manter Previews por branch são configurações do GitHub e da Vercel.
- **Afeta:** DT-015, DT-016 (descrição do deploy) e o `docs/CI-CD.md`.

### DEC-05 — Política para os dados de fallback dos satélites

- **Decisão:** se a API deve devolver dados de exemplo quando não há credenciais ou a fonte falha, e com quais dados.
- **Por que o código não decide:** os TLEs de fallback estão fixos em `route.ts:73-154`.
  - Os de `stations`, `starlink` e `weather` são de 20/01/2024 (época `24020`). TLEs com mais de dois anos não servem para calcular a posição atual de satélites em órbita baixa.
  - Os do grupo `ideiaspace` têm época `26021` e elementos redondos (inclinação 97,5°, movimento médio 15,1), padrão de dado ilustrativo.
  - O `starlink` tem 10 satélites, 4 deles fora da lista configurada.

  A resposta só indica que é fallback pelo cabeçalho `X-Cache-Status: FALLBACK`. Se o consumidor trata esses dados como reais é uma questão de produto.
- **Afeta:** DT-011 e o `API_DOCUMENTATION.md` (P15).

### DEC-06 — Páginas legais e conteúdo provisório

- **Decisão:**
  - publicar ou remover `/terms` e `/privacy`;
  - o destino da página `teacher-resources`;
  - quando ativar os cards "Work in Progress" de Recursos, e com quais links;
  - os nomes reais dos parceiros 4 a 9;
  - os links de LinkedIn e Facebook;
  - os textos das traduções vazias.
- **Por que o código não decide:** depende de conteúdo que não está no repositório. O formulário coleta nome e e-mail, então a necessidade e o conteúdo de uma política de privacidade devem ser avaliados pelo time e, se preciso, por assessoria jurídica.
- **Afeta:** DT-008, DT-009 e DT-007.

### DEC-07 — Quem pode embutir o site

- **Decisão:** se algum site parceiro precisa exibir o site num iframe e, se precisar, quais domínios.
- **Por que o código não decide:** o `frame-ancestors *` veio do commit `a303076` ("iframe liberado", 19/05/2026), sem registro de quem embute o site.
- **Afeta:** DT-013.

### DEC-08 — Proteção das branches `main` e `dev`

- **Decisão:** exigir PR e CI verde por regra do GitHub, ou manter isso como regra do time.
- **Por que o código não decide:** é configuração do repositório. Hoje `main` e `dev` têm `protected=false` e nenhuma regra (`/rules/branches/<branch>` → `[]`), e o GitHub sugere `main` como base dos PRs. O `docs/CI-CD.md` traz uma proposta de proteção para `main`.
- **Afeta:** DT-003 (evitar que `dev` volte a ficar para trás) e o fluxo descrito no `CONTRIBUTING.md`.

### DEC-09 — Destino do satélite 3D da branch `dev`

- **Decisão:** se o commit `e80cf1e` (satélite 3D no Hero, de 08/09/2026) vai para produção na próxima publicação.
- **Por que o código não decide:** o commit está só em `dev`, sem PR e sem execução de CI. Ele adiciona `@react-three/fiber` e `@react-three/drei`, passa a usar `three` e inclui um modelo `cubesat.glb` de 1,2 MB fora do Git LFS (que só cobre `*.mp4`).
- **Afeta:** DT-003, DT-019 (`three`), DT-013 (CSP) e DT-001 (as novas dependências entram no `npm audit`).

---

## 7. Itens resolvidos

Problemas registrados nas fases anteriores que deixaram de existir. Para evitar retrabalho, não os trate como pendências.

| Item original | Tratamento | Fase |
|---|---|---|
| P01 — falha do Resend respondia `200` com sucesso | A rota trata o `error` do SDK e responde `500`; há teste com o SDK real; a documentação foi alinhada. **Ainda não publicado**: produção (`main`) mantém o comportamento antigo (DT-002) | Saneamento (08/10/2026, sem commit) |
| P02 — fluxo de branches documentado diferente do usado | README, CONTRIBUTING e GUIA descrevem o fluxo do time. A sincronização de `dev` continua pendente (DT-003) | Saneamento |
| P03 — PR #1 e `npm audit` sem registro | BACKLOG e SECURITY registram os avisos e a situação do PR #1. As vulnerabilidades continuam (DT-001) | Saneamento |
| P09 (parte) — "CI verde obrigatório" sem regra que o imponha | O texto passou a dizer que é regra do time. A proteção de branch é a DEC-08 | Saneamento |
| D1–D13 — README desatualizado (idioma padrão, Node 18, arquivos inexistentes, variáveis, APIs, componentes, URL de clone, nomes de rota, validações, logs, lazy loading) e CONTRIBUTING citando Three.js | README reescrito, `.env.example` criado e CONTRIBUTING corrigido | Fase 3 |
| Lacunas de documentação da auditoria (§12): arquitetura, pipeline de mídia, variáveis, Git LFS, rotas × menu, código morto, scripts | `docs/ARQUITETURA.md`, `docs/GUIA_OPERACIONAL.md` e `.env.example`. As lacunas restantes estão em DT-016 | Fases 2 a 4 |
| A18 — `graphify-out/` fora do `.gitignore` | Já estava ignorado (`.gitignore:45`) | Fase 1 (constatado) |
| Injeção de HTML no e-mail do contato | Campos escapados (`route.ts:20-27`), com teste (`contact.test.ts:80-87`) | PR #2 (14/09/2026) |
| `new Resend()` no nível do módulo quebrava o build sem a chave | Instanciação sob demanda (`route.ts:7-10`) | PR #2 |
| `ResourceCard` criava um componente durante o render | Virou um elemento JSX (`ResourceCard.tsx:26`) | PR #2 |
| `pt.json` sem 14 chaves | Paridade restaurada e verificada pelo teste `messages-parity.test.ts` | PR #2 |

Os itens do PR #2 foram conferidos de novo no código em 08/10/2026 e continuam corrigidos.

---

## 8. Itens descartados

Foram analisados e não são dívida técnica.

| Item | Por que não é dívida |
|---|---|
| A13 — *cloud name* `dgyueliom` fixo no código | É público por natureza (aparece em toda URL de mídia) e está documentado como valor padrão. Não é segredo nem defeito |
| D9 (parte técnica) — `/services` é o Desafio e `/technologies` são os Recursos | O nome da URL é decisão de produto, já documentada ([ARQUITETURA §9](ARQUITETURA.md#nome-da-rota--nome-no-menu)). Renomear exigiria redirecionamentos, sem ganho funcional |
| Dois `<h1>` na Home | O HTML é válido, e o efeito em SEO e acessibilidade é pequeno. Pode ser revisto junto com DT-007 |
| Bandeiras do seletor de idioma aparecem como "BR", "US" e "ES" no Windows | O Windows não desenha emojis de bandeira, e a sigla continua compreensível. É comportamento da plataforma |
| `installCommand: npm install` na Vercel, contra `npm ci` no CI | Com o lockfile presente, o `npm install` instala as versões travadas. Se o lockfile divergir, o CI (`npm ci`) falha antes |
| Workflows fazem checkout sem `lfs: true` | Nenhum workflow usa os vídeos, e o site não serve os arquivos de `public/assets/compressed/` |
| Issue #7: o `StatsCounter` perderia o `k` de `"50k"` | Os valores atuais são numéricos e são lidos corretamente. Só seria problema com outro formato de número |
| O02 — a branch `documentacao` nunca passou pelo CI | Estado transitório: o CI roda quando o PR é aberto |
| O03 — o Turbopack falha em caminhos longos no Windows | É limitação do ambiente, não do projeto |
| O04 — materiais de estudo no histórico público | Não contêm segredos. Manter ou reescrever o histórico é decisão pessoal do autor, sem efeito no funcionamento |
| O07 — `NEXT_LOCALE` é cookie de sessão | É o comportamento padrão do next-intl |
| O08 — mensagem do `compress:videos` sem FFmpeg | É só uma diferença de texto, sem efeito técnico |
| P29, P30 e a frase da Fase 3 sobre o gitleaks (P11) | São erros em materiais de estudo pessoais, fora do Git. O efeito técnico do P11 está em DT-024 |

---

## 9. Relação com o backlog atual

### Papel de cada documento

| Documento | Papel |
|---|---|
| [`docs/BACKLOG.md`](BACKLOG.md) | Índice das issues abertas no GitHub, onde o trabalho é acompanhado. Também registra a segurança das dependências e as correções do PR de CI |
| `docs/DIVIDA_TECNICA.md` (este) | Registro completo e priorizado do que está pendente, com ou sem issue, mais as decisões, os itens resolvidos e os descartados |
| [ARQUITETURA §14](ARQUITETURA.md#14-limites-e-pontos-conhecidos) | Limites do sistema, explicados para quem vai mexer no código |

Para não duplicar, a tabela de vulnerabilidades e a situação do PR #1 continuam só no BACKLOG. A DT-001 resume e aponta para lá.

### Issues existentes

Conferidas pela API pública do GitHub em 08/10/2026. Todas estão abertas desde 09/09/2026 e sem comentários.

| Issue | Tema | Situação no código atual | Itens | A issue está atualizada? |
|---|---|---|---|---|
| #3 | Rate limiting no contato | Continua igual | DT-012 | Sim |
| #4 | CSP | Continua igual | DT-013 | Em parte. Cita Three.js, react-globe.gl e workers do globo, que não são usados, e propõe `connect-src` para chamadas que são do servidor |
| #5 | Login no Space-Track e cache em memória | Continua igual | DT-011 | Sim. Falta a chave de cache aberta (`groups`) |
| #6 | `dangerouslySetInnerHTML` | 6 pontos, nas mesmas linhas | DT-018 | Sim. A frase sobre o `wordpress.ts` exagera |
| #7 | Testes de componente e E2E | Nenhum teste de componente ou E2E | DT-014 | Em parte. Cita o globo da página de missões, a navegação do next-intl no Header e o `AboutCarousel` |
| #8 | Itens menores do code review | Todos continuam, exceto o `MethodologyCarousel`, que já usa `next/image` | DT-004, DT-008, DT-011, DT-019, DT-022 e DT-023 | Em parte. "Linha ~305" do `console.log` hoje é a 346, e os TLEs do grupo `ideiaspace` são de 2026, não de 2024 |
| PR #1 | `next` 16.0.7 (`vercel[bot]`) | Superado: o projeto já usa a 16.0.8 | DT-001 | Fechar é decisão do time |

**Duplicações.** Nenhuma issue repete outra:

- #5 e #8 falam do mesmo arquivo (`satellites/route.ts`), mas de problemas diferentes;
- a #8 agrupa temas de prioridades diferentes (P1 a P3), por isso aparece em seis itens;
- fora das issues, a seção "Corrigidos no PR de CI" do BACKLOG repete o "Corrigido" do CHANGELOG.

**Itens sem issue.** São 14 dos 24:

- DT-001, DT-002, DT-003, DT-005, DT-006, DT-007, DT-009, DT-010;
- DT-015, DT-016, DT-017, DT-020, DT-021, DT-024.

DT-004 e DT-008 têm só uma parte coberta pela #8. Os três itens P0 não têm issue.

**O número da issue não indica prioridade.** A #3 é a mais antiga das abertas e está em P2. A DT-001, que é P0, não tem issue.

Nenhuma issue foi criada, editada ou fechada nesta fase. Abrir issues para os itens P0 e P1 e atualizar as issues #4, #7 e #8 fica a cargo do time.

### Ajustes de referência feitos nesta fase

- `docs/BACKLOG.md`: uma linha na introdução aponta para este registro.
- `README.md`: este documento entrou na tabela de documentação.
- `docs/ARQUITETURA.md` §14: uma linha aponta para este registro, onde está a priorização dos limites.

---

## 10. Limitações

### O que depende de fora do repositório

| Depende de | Itens | O que falta saber ou fazer |
|---|---|---|
| Painel da Vercel | DT-002, DT-006, DT-010, DT-015 | Se `RESEND_API_KEY`, `N2YO_API_KEY` e `SPACETRACK_*` estão em Production; a versão do Node; as variáveis dos Previews; a configuração de LFS e de Previews |
| GitHub | DT-003, DT-001, DEC-08 | Escrita na branch `dev` e configuração de proteção de branch. Os alertas do Dependabot e do code scanning não aparecem sem autenticação |
| Serviços externos | DT-002, DT-011, DT-020 | Resend: dono da conta e domínio verificado. N2YO e Space-Track: comportamento real e limites. Cloudinary: modo de pastas dos novos uploads |
| Decisões do time | DEC-01 a DEC-09 | Seção 6 |
| Credenciais | DT-011, DT-014, DT-020 | Testar só com contas de teste próprias, nunca com as de produção |
| Conhecimento do negócio | DEC-02, DEC-05, DEC-06 | Números de impacto, dados de exemplo, conteúdo e páginas legais |

### Itens incertos

| Questão | Por que continua incerta | Como resolver |
|---|---|---|
| A produção tem `RESEND_API_KEY`? O e-mail da conta do Resend é `admin@ideiaspace.com`? | Os painéis não foram acessados | Vercel e Resend (DT-002) |
| Os avisos críticos do `next` se aplicam à hospedagem na Vercel? | A aplicabilidade não foi avaliada | Atualizar (DT-001) torna a avaliação desnecessária |
| A produção tem credenciais da N2YO e do Space-Track? Quem consome `/api/satellites`? | A rota de produção não foi chamada, para não disparar logins no Space-Track | Vercel e time (DEC-03) |
| Os IDs NORAD 66668 a 66670 do fallback são números reais do catálogo? | Não foram conferidos | Catálogo do Space-Track (DEC-05) |
| Os Previews têm `NEXT_PUBLIC_USE_CLOUDINARY`? | Depende do painel | Vercel (DT-010) |
| Que versão do Node a Vercel usa em produção? | Depende do painel | Vercel (DT-006) |

### Como a verificação foi feita

- **Código e configuração.** Leitura direta, buscas por importadores, lint e relatório de cobertura dos testes.
- **Execução.** Build de produção do estado atual, servido localmente (`next start`) num clone fora do repositório e sem variáveis de ambiente. O comportamento no navegador (cliques e `mailto:`) foi avaliado pelo código: não houve automação de navegador.
- **Produção.** Só requisições `GET` a páginas que já existiam, sem chamar as APIs.
- **GitHub.** API pública, sem autenticação e só leitura.
- **Dependências.** `npm audit`, que consulta a base de avisos do registro npm e muda com o tempo.
- **Documentação de terceiros.** A restrição do Resend e o calendário do Node.js foram conferidos nas fontes oficiais, citadas nas fichas.
