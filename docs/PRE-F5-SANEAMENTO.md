# Saneamento pré-Fase 5 (P01–P03)

> Registro das correções feitas em 08/10/2026 sobre o commit `71d104c` (branch `documentacao`), antes do início da Fase 5. Os problemas tratados são os três itens obrigatórios do laudo [`docs/REVISAO-FINAL-DOCUMENTACAO.md`](REVISAO-FINAL-DOCUMENTACAO.md). Nada foi commitado. Este arquivo e o laudo são arquivos novos, ainda não versionados.

---

## 1. Objetivo

A revisão final classificou três problemas como correções obrigatórias antes da Fase 5:

| Item | Severidade no laudo | Por que não podia esperar |
|---|---|---|
| **P01** | CRÍTICO | Quando o Resend falhava, a API respondia `200` com "Mensagem enviada com sucesso!" e a mensagem do visitante se perdia. Três documentos afirmavam o oposto (`500` com `mailto:`), e um teste "comprovava" isso com um mock que não seguia o contrato do SDK |
| **P02** | ALTO | A documentação mandava criar branches a partir de `dev`, que está 12 commits atrás de `main`, sem CI nem testes. Quem a seguisse trabalharia sobre código desatualizado. Ela também não dizia que o histórico não segue o fluxo nem que o GitHub não o impõe |
| **P03** | ALTO | Nenhum documento registrava o PR #1 (segurança) nem o alerta crítico do `npm audit` no `next`. A Fase 5 seria planejada sem esse dado |

O escopo foi limitado a esses três itens. Os demais problemas do laudo continuam abertos (seção 6).

---

## 2. P01 — Falha do Resend tratada como sucesso

### Problema encontrado

Com `RESEND_API_KEY` configurada, se o Resend recusasse o envio ou estivesse inacessível, `POST /api/contact` respondia `200` com sucesso, sem enviar nada.

### Comportamento anterior

| Ponto de vista | O que acontecia |
|---|---|
| **Esperado pelo teste** (`contact.test.ts`, caso "erro do Resend → 500") | O mock fazia `emails.send` **rejeitar** a Promise (`mockRejectedValue(new Error('resend down'))`). A exceção caía no `catch` da rota, que responde `500` com `mailtoLink`. O teste passava |
| **Código da rota** | Só tratava **exceções** (`try/catch`). O resultado do envio era lido como `data.data?.id`, e o campo `error` do retorno era ignorado |
| **SDK real** (`resend` 6.5.2) | `emails.send` → `create` → `post('/emails')` → `fetchRequest`. Esse método **nunca lança exceção** em erro HTTP nem em falha de rede: devolve `{ data: null, error }` (`node_modules/resend/dist/index.mjs:791-842`; tipo `Response<T>` em `index.d.mts:70-78`). Por isso o `catch` nunca era acionado nesses casos |

Reprodução feita nesta sessão, com o build de produção do commit `71d104c` (`next start`) e o SDK apontado para endereços locais por meio de `RESEND_BASE_URL`, sem chamar o serviço real:

| Cenário | Resposta | Log do servidor |
|---|---|---|
| Resend inacessível (porta local fechada) | `200 {"success":true,"message":"Mensagem enviada com sucesso! Entraremos em contato em breve."}` | `Email sent successfully: undefined` |
| Resend recusa (stub local respondendo `403 validation_error`) | Mesma resposta `200` | `Email sent successfully: undefined` |

O novo teste com o SDK real (abaixo) também reproduziu o defeito antes da correção: os casos de recusa `403` e de falha de rede falharam com `expected 200 to be 500`.

### Causa

A rota foi escrita (e testada) supondo que o SDK lançaria exceção em caso de erro. O SDK v6 informa erros no valor de retorno. O mock do teste reproduzia a suposição, e não o contrato real, por isso o defeito passava pelo CI.

### Alteração realizada

**Contrato escolhido.** Mantido o contrato **já documentado**: falha no envio → `500` com `{ error, useMailto: true, mailtoLink }`. API_DOCUMENTATION, ARQUITETURA, GUIA e o próprio teste já o descreviam, e o `catch` da rota já o implementava. Faltava aplicá-lo ao `error` devolvido pelo SDK. Não se criou contrato novo. A alternativa de responder `200` com o `mailto` completo, para o formulário abrir o cliente de e-mail, mudaria o contrato e se confunde com o P07 (seção 6), por isso não foi adotada.

| Arquivo | Mudança |
|---|---|
| `src/app/api/contact/route.ts` | O retorno de `emails.send` passa a ser desestruturado em `{ data, error }`. Se houver `error`: log `Error sending email:` e resposta `500` com fallback. A resposta de falha foi extraída para `sendFailedResponse()`, usada pelo novo ramo e pelo `catch`, com o mesmo corpo e status de antes. Um comentário explica o contrato do SDK. O editor removeu espaços no fim de três linhas do trecho editado, conforme o `.editorconfig`, sem efeito no comportamento |
| `src/app/api/__tests__/contact.test.ts` | O mock padrão passa a ter o formato real (`{ data, error: null }`). Novo caso: "Resend devolve error (recusa ou falha de rede) → 500". O caso antigo foi renomeado para "exceção ao chamar o Resend → 500", que é o que ele de fato testa |
| `src/app/api/__tests__/contact.resend-sdk.test.ts` (novo) | Usa o **SDK real**, com só o `fetch` simulado: aceite → `200` com `emailId`; recusa `403` → `500`; falha de rede → `500`. Assim, uma mudança futura no contrato do SDK passa a quebrar o CI |
| `API_DOCUMENTATION.md` | Explica quando o `500` ocorre; precisa o "Modo Erro"; atualiza a linha do Estado de Verificação; atualiza a data |
| `docs/ARQUITETURA.md` | §11: rótulo da aresta de erro no diagrama e um parágrafo sobre o contrato do SDK. §13: novo arquivo de teste e contagem (8 arquivos, 35 testes) |
| `docs/GUIA_OPERACIONAL.md` | §7.3: a frase sobre a cobertura dos testes. O restante do parágrafo, que já previa `500` e `Error sending email`, passou a ser verdadeiro |
| `CHANGELOG.md` | Entrada em "Corrigido" |

### Comportamento posterior

Mesma reprodução, com o código corrigido (build de produção):

| Cenário | Resposta | Log do servidor |
|---|---|---|
| Resend inacessível | `500 {"error":"Erro ao enviar mensagem. Abrindo cliente de email...","useMailto":true,"mailtoLink":"mailto:admin@ideiaspace.com"}` | `Error sending email: { name: 'application_error', statusCode: null, message: 'Unable to fetch data…' }` |
| Resend recusa (`403`) | Mesma resposta `500` | `Error sending email: { statusCode: 403, name: 'validation_error', … }` |
| Resend aceita (stub respondendo `200 {id}`) | `200 {"success":true,…,"emailId":"email_stub_ok_123"}` | `Email sent successfully: email_stub_ok_123` |
| Sem `RESEND_API_KEY` | `200` com `useMailto` e `mailtoLink` completo (inalterado) | `RESEND_API_KEY not configured. Using mailto fallback.` |

### Testes executados

| Comando | Resultado |
|---|---|
| `npx vitest run src/app/api/__tests__/contact.resend-sdk.test.ts`, **antes** da correção | 2 falhas (`expected 200 to be 500`) e 1 aprovação: reprodução |
| `npx vitest run contact`, depois | 3 arquivos, 12 testes aprovados |
| `npm run lint` | 0 erros, 24 avisos (os mesmos de antes; nenhum novo) |
| `npm run typecheck` | Sem erros |
| `npm run test:run` | 8 arquivos, 35 testes aprovados |
| `npm run test:ci` | 35 aprovados; cobertura 70,26 / 78,64 / 80 / 70,26 (limites 55/60/55/55); a rota de contato foi de 94,84% para 95,19% em linhas e de 95,65% para 96% em ramos |
| `npm run build` | Aprovado (Turbopack, 18 páginas SSG, APIs dinâmicas). Ver a observação de ambiente na seção 5 |

---

## 3. P02 — Fluxo de branches

### Divergência encontrada

| | Conteúdo |
|---|---|
| **Fluxo documentado** (commit `71d104c`) | "Branch a partir de `dev`", "PR para `dev`", "`dev` → `main` quando for para produção" (`README.md:246`, `CONTRIBUTING.md:32,38`, `docs/GUIA_OPERACIONAL.md:157,171,185-192`) |
| **Fluxo do time** (informado pelo time em 08/10/2026) | Branch a partir de `main` → PR para `dev` → `dev` acumula as mudanças de várias branches → `dev` é mesclada em `main` para publicar tudo de uma vez. A documentação errava a base da branch (`dev` em vez de `main`). O destino do PR e a publicação via `dev` estavam certos |
| **Fluxo observado** (git e API pública do GitHub, 08/10/2026) | Existem 3 PRs, **todos com base `main`**: #2 (`chore/ci-cd-quality`, mesclado em 14/09/2026), #9 (`fix/stats-card-counters`, mesclado em 06/10/2026) e #1 (`vercel[bot]`, aberto). **Nenhum PR teve `dev` como base.** Antes de 14/09/2026, as mudanças entravam por commits diretos em `main` |
| **Situação de `dev`** | Último commit `e80cf1e` (08/09/2026, satélite 3D no Hero), que não está em `main`; 12 commits atrás de `main`; parte de `ed66a46` (08/06/2026); não tem `.github/` (nenhum workflow) nem os testes. Simulação com `git merge-tree`, num clone temporário: mesclar `main` em `dev` gera conflito em `package-lock.json`, e os demais arquivos se mesclam sem conflito. O mesmo vale para a branch `documentacao` |
| **Configuração do GitHub** | Branch padrão `main`: o GitHub sugere `main` como base dos PRs. `main` e `dev`: `protected=false` e `GET /rules/branches/<branch>` → `[]`; `GET /rulesets` → `[]`. Nada impõe o fluxo, o PR nem o CI verde |

**Primeira versão desta correção.** O laudo deixava a escolha do fluxo para o time: PRs direto para `main`, ou sincronizar `dev` e usá-la. Sem essa resposta, a primeira versão desta correção, feita nesta mesma sessão, adotou o fluxo observado (PR direto para `main`) e descreveu `dev` como fora do fluxo. Depois, o time informou o fluxo acima, e a correção foi refeita. Nada da primeira versão foi commitado.

### Documentação afetada e correção realizada

| Arquivo | Correção |
|---|---|
| `CONTRIBUTING.md` (seção Fluxo) | Reescrita em três partes separadas: **fluxo do time** (branch a partir de `main`; PR para `dev` com CI verde antes do merge; `dev` acumula; `dev` mesclada em `main` para publicar); **situação das branches** (nenhum PR para `dev`; PRs #2 e #9 direto para `main`; `dev` 12 commits atrás e com 1 commit próprio; o efeito disso num PR novo); **limitações que dependem do GitHub** (branch padrão `main`; sem proteção de branch nem rulesets; fluxo e CI são regra do time, não bloqueio) |
| `README.md` (Contribuindo) | Resumo do fluxo do time e da limitação do GitHub, aviso de que `dev` está atrás de `main` e link para `CONTRIBUTING.md#fluxo` |
| `docs/GUIA_OPERACIONAL.md` | §5, item 1 (branch a partir de `main`) e item 4 (PR para `dev`, troca da base sugerida pelo GitHub, CI verde como regra do time, situação de `dev`). §6.1, diagrama: só a origem da branch de trabalho (criada a partir de `main`) e o papel de `dev` (acumula as mudanças) |

**Não alterado, por ser correto ou estar fora do escopo:**

- `docs/CI-CD.md`: lista os gatilhos reais dos workflows (que incluem `dev`) e a proteção de branch "sugerida" para `main`.
- Materiais de estudo: são *snapshots*.
- Configuração do GitHub, do CI e da proteção de branch: nada foi criado nem alterado. A branch padrão continua `main`.
- Branch `dev`: não foi sincronizada com `main`. Fazer isso, resolvendo o conflito em `package-lock.json`, é ação do time.

**Sobreposição com P09.** Para registrar a limitação do GitHub, pedida neste item, a expressão "CI verde obrigatório" do README e do CONTRIBUTING virou "CI verde antes do merge", explicando que é regra do time e não bloqueio do GitHub. Ativar ou não a proteção de branch (a outra metade de P09) continua fora do escopo.

---

## 4. P03 — Segurança das dependências e PR #1

### Informações verificadas

| Fonte | Resultado (08/10/2026) |
|---|---|
| PR #1 (API do GitHub e branch local) | Aberto pelo `vercel[bot]` em 11/12/2025, base `main`, **não mesclado**. Única mudança: `next` `16.0.3` → `16.0.7` (versão fixa), em `package.json` e `package-lock.json`. Objetivo: [GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp), execução remota de código no protocolo React Flight, que afeta o `next` 16 abaixo de 16.0.7 |
| Histórico do `package.json` | No mesmo dia (11/12/2025), o commit `bc4f0da` ("Deploy Beta") levou `main` a `next` `^16.0.8`. Desde então essa falha está **corrigida** no projeto, e o PR está **superado** |
| Simulação de merge (`git merge-tree`, sem tocar a working tree) | Mesclar o PR #1 em `main` hoje gera **conflito** em `package.json` e `package-lock.json`. Resolvido a favor do PR, rebaixaria o `next` para 16.0.7 |
| `npm audit --omit=dev` | 11 pacotes de produção: 1 crítico (`next`, direto), 6 altos (`lodash`, `lodash-es`, `nanoid`, `postcss`, `sharp`, `source-map-js`, indiretos), 4 moderados (`next-intl` e `resend`, diretos; `svix` e `uuid`, indiretos) |
| `npm audit` (todas as dependências) | 39 pacotes: 4 críticos, 24 altos, 10 moderados, 1 baixo |
| Avisos do `next` 16.0.8 | 40 (2 críticos, 15 altos, 19 moderados, 4 baixos). Os críticos são [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) (RCE em servidores Windows) e [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) (RCE na otimização de imagens com AVIF; o `next.config.ts:14` habilita AVIF), publicados em 08/09/2026 e corrigidos a partir de 16.3.3. O conjunto todo deixa de se aplicar só a partir de 16.3.8. **A GHSA-9qr9 não aparece**, o que confirma a correção anterior |
| `fixAvailable` do `npm audit` | `true`: há versão corrigida **publicada no registro npm**. Nada foi aplicado ao projeto; o `package-lock.json` continua com o `next` em 16.0.8 |
| Documentação antes | BACKLOG, SECURITY e CHANGELOG não mencionavam o PR #1 nem o `npm audit`. O GUIA:64 tratava o resumo do audit como algo que "não impede o funcionamento", sem dizer que havia alertas reais |

### Documentação afetada e correção realizada

| Arquivo | Correção |
|---|---|
| `docs/BACKLOG.md` | Nova seção "Segurança das dependências (sem issue aberta)", com três blocos separados: **documentado e não corrigido** (avisos atuais, com números e links), **já corrigido** (GHSA-9qr9, desde `bc4f0da`) e **PR #1** (situação, por que está superado, conflito, decisão pendente). Explica o significado de `fixAvailable` e registra a data, porque o resultado muda com o tempo |
| `SECURITY.md` | Item "Dependências" em "Superfície": vulnerabilidades conhecidas ainda não corrigidas, críticos no `next`, PR #1 tratando de outra falha já corrigida, com link para o BACKLOG |
| `docs/GUIA_OPERACIONAL.md` | §2.2: o resumo do `npm audit` não é ruído e inclui vulnerabilidades reais não corrigidas, com links |
| `README.md` | Descrição do BACKLOG na tabela de documentação |

**Não feito, de propósito:**

- Nenhuma dependência foi atualizada.
- O PR #1 não foi fechado nem mesclado (decisão do time).
- A aplicabilidade de cada aviso a este site não foi avaliada.
- O que depende de fonte externa (base de avisos do npm e do GitHub, dados do PR) está marcado com a data da verificação.

---

## 5. Validação

| Item | Antes | Depois | Status |
|---|---|---|---|
| P01 | Recusa ou indisponibilidade do Resend → `200` "Mensagem enviada com sucesso!", log `Email sent successfully: undefined`; documentação e teste afirmavam `500` | Recusa ou indisponibilidade → `500` com `mailtoLink` e log `Error sending email: …`; aceite → `200` com `emailId`; sem chave → inalterado. Teste com o SDK real no CI; documentação descrevendo o comportamento real | ✅ |
| P02 | README, CONTRIBUTING e GUIA mandavam criar a branch a partir de `dev` (12 commits atrás de `main`, sem CI) e não registravam que nenhum PR usou `dev` nem que o GitHub não impõe o fluxo | Os três documentos descrevem o fluxo informado pelo time (branch a partir de `main` → PR para `dev` → `dev` mesclada em `main`), separado da situação atual das branches e das limitações do GitHub | ✅ na documentação. Sincronizar `dev` com `main` fica com o time (seção 6) |
| P03 | Nenhuma menção ao PR #1 nem aos alertas do `npm audit`; o GUIA tratava o audit como ruído | BACKLOG e SECURITY registram os alertas atuais (não corrigidos), o que já foi corrigido e a situação do PR #1 (superado, não mesclado); o GUIA e o README apontam para lá | ✅ |

Verificações executadas:

| Verificação | Resultado |
|---|---|
| `npm run lint` | 0 erros, 24 avisos (mesma contagem de antes) |
| `npm run typecheck` | Sem erros |
| `npm run test:run` | 8 arquivos, 35 testes aprovados |
| `npm run test:ci` | Aprovado, cobertura acima dos limites (ver observação de ambiente) |
| `npm run build` | Aprovado (ver observação de ambiente) |
| Cenário de falha do Resend em HTTP | Reproduzido antes (`200`) e depois (`500`), com aceite e sem chave conferidos |
| Diagramas Mermaid da ARQUITETURA | 7 de 7 válidos, incluindo o diagrama alterado (mermaid-cli 11.17.2) |
| Links e âncoras dos documentos oficiais | 114 verificados, 0 problemas (inclui as âncoras `#fluxo`, `#61-caminho-do-código-até-produção` e `#segurança-das-dependências-sem-issue-aberta`) |

**Observação de ambiente (não corrigida, fora do escopo).** O repositório fica dentro do OneDrive, e as pastas geradas `coverage/` e `.next/` têm subpastas convertidas em *placeholders* do OneDrive (atributos `ReadOnly` e `ReparsePoint`).

- O `npm run test:ci` travou na limpeza de `coverage/` antes de rodar os testes. Foi repetido com `--coverage.reportsDirectory` apontando para fora do OneDrive, e passou.
- O `npm run build` falhou com `EPERM: operation not permitted, rmdir '.next\build\chunks'`. O mesmo código foi compilado num clone limpo do commit `71d104c`, fora do OneDrive, com os três arquivos alterados copiados (idênticos, conferidos com `diff`), e passou. No mesmo clone foi feita a reprodução HTTP.

O problema não tem relação com as mudanças desta sessão. Para resolvê-lo, retire `.next/` e `coverage/` da sincronização do OneDrive ou mantenha o repositório fora dele.

**Arquivos alterados nesta sessão** (`git diff --stat`, ignorando finais de linha): 10 modificados e 2 novos. Nenhum arquivo fora do escopo foi tocado.

| Arquivo | Item |
|---|---|
| `src/app/api/contact/route.ts` | P01 |
| `src/app/api/__tests__/contact.test.ts` | P01 |
| `src/app/api/__tests__/contact.resend-sdk.test.ts` (novo) | P01 |
| `API_DOCUMENTATION.md` | P01 |
| `docs/ARQUITETURA.md` | P01 |
| `CHANGELOG.md` | P01 |
| `CONTRIBUTING.md` | P02 |
| `README.md` | P02 (Contribuindo) e P03 (tabela de documentação) |
| `docs/GUIA_OPERACIONAL.md` | P01 (§7.3), P02 (§5 e §6.1) e P03 (§2.2) |
| `docs/BACKLOG.md` | P03 |
| `SECURITY.md` | P03 |
| `docs/PRE-F5-SANEAMENTO.md` (novo) | Este registro |

---

## 6. Itens deliberadamente não tratados

Todos os demais problemas e observações do laudo **continuam fora do escopo e abertos**: P04 a P32 e O01 a O09, com a exceção parcial de P09 descrita na seção 3. Os que mais se relacionam com esta sessão:

- **P07 — formulário em resposta 500.** O `ContactForm` só abre o cliente de e-mail quando `response.ok`. Com a correção de P01, uma falha do Resend agora mostra o erro "Erro ao enviar mensagem. Abrindo cliente de email..." em vez de um falso sucesso, o que é melhor. Mas nenhum cliente de e-mail é aberto, apesar do texto. Antes era um caso teórico; agora é o comportamento real em caso de falha, o que torna o P07 **mais visível**. A documentação que afirma o redirecionamento em 500 (`API_DOCUMENTATION.md:421`, ARQUITETURA §11) não foi alterada.
- **P04 e P05 — deploy.** O diagrama do GUIA §6.1 continua com "vercel.json habilita o deploy automático de main" e "Git LFS ativo". Só mudaram a origem da branch de trabalho e a descrição de `dev`.
- **P08 — cobertura dos testes de satélites**, **P06 — cookie de idioma** e os demais itens de documentação.
- **Dependências**: nenhuma atualização (inclusive do `next`). O PR #1 não foi fechado nem mesclado. A aplicabilidade dos avisos não foi avaliada.
- **Branch `dev`**: não foi sincronizada com `main`. Enquanto isso não for feito, um PR para `dev` leva commits a mais e tem conflito em `package-lock.json`. Também não foi configurada proteção de branch, ruleset nem CI, e a branch padrão do repositório continua `main`.
- **Ambiente OneDrive** (seção 5): só registrado.
- O laudo `REVISAO-FINAL-DOCUMENTACAO.md` não foi editado. Ele é o retrato da revisão; este documento registra o que mudou depois.
