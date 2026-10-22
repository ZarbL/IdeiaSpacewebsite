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

## Corrigidos no PR de CI

- injeção de HTML no email do `/api/contact` (campos sem escape)
- `new Resend()` no nível do módulo quebrava o `next build` sem a chave
- `ResourceCard` criava um componente durante o render
- `pt.json` sem 14 chaves de tradução
