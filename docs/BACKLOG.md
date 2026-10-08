# Backlog

Tarefas do code review e da configuração de CI — abertas como **issues** com
contexto (arquivo, passos, critério de pronto).

👉 https://github.com/ZarbL/IdeiaSpacewebsite/issues

| # | Tema | Labels |
|---|---|---|
| [#3](https://github.com/ZarbL/IdeiaSpacewebsite/issues/3) | `/api/contact` sem rate limiting | security |
| [#4](https://github.com/ZarbL/IdeiaSpacewebsite/issues/4) | CSP: `frame-ancestors *` + ausência de CSP completa | security |
| [#5](https://github.com/ZarbL/IdeiaSpacewebsite/issues/5) | `/api/satellites`: login no Space-Track por request + cache serverless inútil | security · bug |
| [#6](https://github.com/ZarbL/IdeiaSpacewebsite/issues/6) | `dangerouslySetInnerHTML` alimentado por traduções | security · tech-debt |
| [#7](https://github.com/ZarbL/IdeiaSpacewebsite/issues/7) | Testes de componente + E2E (Playwright) | test · ci |
| [#8](https://github.com/ZarbL/IdeiaSpacewebsite/issues/8) | Itens menores: `any`, dados de satélite inline, `wordpress.ts` morto, `<img>` | tech-debt |

## Segurança das dependências (sem issue aberta)

Situação verificada em 08/10/2026. O resultado do `npm audit` depende da base de
avisos do registro npm e muda com o tempo: rode de novo antes de agir. No CI, o
job `npm audit` do `security.yml` é só informativo e não bloqueia PR nem deploy.

**Documentado e não corrigido**

| Item | Situação no projeto | Fonte |
|---|---|---|
| `next` 16.0.8 (dependência direta) | 40 avisos: 2 críticos, 15 altos, 19 moderados e 4 baixos. Os críticos são [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) (execução remota de código em servidores Windows) e [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) (execução remota de código na otimização de imagens com AVIF; o `next.config.ts` habilita AVIF). Os dois são corrigidos a partir da 16.3.3; o conjunto todo, só a partir da 16.3.8. **Nenhuma atualização foi aplicada**: o `package-lock.json` continua com o `next` em 16.0.8 | `npm audit --omit=dev` |
| Outras dependências de produção | 6 altos (`lodash`, `lodash-es`, `nanoid`, `postcss`, `sharp`, `source-map-js`, todos indiretos) e 4 moderados (`next-intl` e `resend`, diretos; `svix` e `uuid`, indiretos). Não corrigidos | `npm audit --omit=dev` |
| Todas as dependências, incluindo as de desenvolvimento | 39 pacotes: 4 críticos, 24 altos, 10 moderados, 1 baixo | `npm audit` |

Quando o `npm audit` informa que há correção (`fixAvailable`), isso significa que
existe versão corrigida publicada no registro npm, e não que o projeto já a use.
A aplicabilidade de cada aviso a este site não foi avaliada.

**Já corrigido**

| Item | Situação | Fonte |
|---|---|---|
| [GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp): execução remota de código no protocolo React Flight (`next` 16 abaixo de 16.0.7) | Corrigido desde o commit `bc4f0da` (11/12/2025), que levou o `next` a `^16.0.8`. Não aparece no `npm audit` atual | `package.json`; base de avisos do GitHub |

**[PR #1](https://github.com/ZarbL/IdeiaSpacewebsite/pull/1): "Fix React Server Components RCE vulnerability"**

- Aberto pelo `vercel[bot]` em 11/12/2025, com base `main`. **Não foi mesclado.**
- Muda o `next` de `16.0.3` para `16.0.7` (versão fixa) para corrigir a
  GHSA-9qr9-h5gf-34mp.
- **Está superado:** o projeto já usa a 16.0.8, posterior à do PR, e essa falha
  já está corrigida. O PR **não** resolve os avisos atuais listados acima.
- Mesclá-lo hoje gera conflito em `package.json` e `package-lock.json`
  (simulação local com `git merge-tree`). Se o conflito for resolvido a favor do
  PR, o `next` volta para a 16.0.7.
- Fechar o PR e atualizar o `next` são decisões do time, previstas para a Fase 5.

## Corrigidos no PR de CI

- injeção de HTML no email do `/api/contact` (campos sem escape)
- `new Resend()` no nível do módulo quebrava o `next build` sem a chave
- `ResourceCard` criava um componente durante o render
- `pt.json` sem 14 chaves de tradução
