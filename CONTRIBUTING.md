# Contribuindo

Site institucional da IdeiaSpace — **Next.js 16 (App Router) + React 19**,
`next-intl` (pt/en/es), Cloudinary para mídia,
Resend para o formulário de contato. Sem backend próprio: as duas rotas
server-side vivem em `src/app/api/` e rodam como funções na Vercel.

## Setup

```bash
git lfs pull       # vídeos (*.mp4) ficam no Git LFS
npm ci
cp .env.example .env.local   # opcional
npm run dev        # http://localhost:3000
```

Variáveis de ambiente (todas opcionais — há fallback; modelo em `.env.example`):

| var | para quê | sem ela |
|---|---|---|
| `RESEND_API_KEY` | envio real do formulário de contato | cai para `mailto:` |
| `N2YO_API_KEY` | TLEs de satélites (grupos não-IdeiaSpace) | dados estáticos de fallback |
| `SPACETRACK_USERNAME` / `SPACETRACK_PASSWORD` | TLEs dos satélites IdeiaSpace | fallback |
| `NEXT_PUBLIC_USE_CLOUDINARY` | servir vídeo/imagem do Cloudinary | `/assets/` local — os vídeos não carregam nesse modo (ver `docs/ARQUITETURA.md`, seção 8) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | conta Cloudinary das URLs e do script de upload | valor padrão em `src/lib/cloudinary.ts` |

As `NEXT_PUBLIC_*` são lidas no build (e ao iniciar o `next dev`): mudou o
valor, refaça o build ou reinicie o servidor.

## Fluxo

Fluxo do time (informado pelo time em 08/10/2026):

1. Branch a partir de `main`: `feat/...`, `fix/...`, `chore/...`.
2. Conventional Commits (`feat:`, `fix:`, `docs:`…).
3. Antes do PR:
   ```bash
   npm run lint && npm run typecheck && npm run test:ci && npm run build
   ```
4. PR para `dev`, com o CI verde antes do merge. A `dev` acumula as mudanças
   de várias branches.
5. Quando o time decide publicar, `dev` é mesclada em `main` e as mudanças
   acumuladas vão para produção de uma vez (a Vercel publica em push para
   `main`).

**Situação das branches (verificada em 08/10/2026).** O histórico ainda não
segue esse fluxo:

- Nenhum PR teve `dev` como base. Os dois PRs mesclados até hoje, #2
  (`chore/ci-cd-quality`) e #9 (`fix/stats-card-counters`), foram direto para
  `main`. Até setembro de 2026, as mudanças entravam por commits diretos em
  `main`.
- Por isso, `dev` está 12 commits atrás de `main`: não tem o CI, os testes nem
  esta documentação. Ela tem 1 commit que ainda não foi para `main`
  (`e80cf1e`, satélite 3D no Hero, de 08/09/2026).
- Enquanto `dev` não receber o que está em `main`, um PR de uma branch nova
  para `dev` leva junto esses 12 commits e tem conflito em `package-lock.json`
  (simulação com `git merge-tree`).

**Limitações que dependem da configuração do GitHub.** A branch padrão do
repositório é `main`, por isso o GitHub sugere `main` como base ao abrir um PR:
troque para `dev`. `main` e `dev` não têm proteção de branch nem rulesets
ativas (API pública do GitHub, 08/10/2026). Nada impede PR direto para `main`,
push direto nem merge com o CI vermelho: o fluxo e o CI verde são regra do
time, não bloqueio automático. A proteção sugerida está em
[`docs/CI-CD.md`](docs/CI-CD.md#branch-protection-sugerida-para-main).

## Testes

Vitest + Testing Library + jsdom.

- `npm test` (watch), `npm run test:run`, `npm run test:ci` (cobertura)
- `npm run test:fuzz` — arquivos `*.fuzz.test.ts` (fast-check). `FUZZ_RUNS`
  escala as iterações no run noturno.

Cobrimos hoje: `lib/cloudinary`, `controllers/home.controller`, as rotas
`api/contact` e `api/satellites` (integração, com `resend`/`fetch` mockados) e a
paridade dos arquivos de tradução (`messages/*.json`).

## Estrutura

```
src/
├── app/[locale]/     # páginas (App Router, segmento de locale)
├── app/api/          # rotas server-side (contact, satellites)
├── components/       # componentes de UI
├── views/sections/   # seções de página compostas
├── controllers/      # montagem de conteúdo a partir das traduções
├── models/           # tipos de conteúdo
├── lib/              # cloudinary, wordpress, assets
└── proxy.ts          # middleware do next-intl (Next 16 renomeou middleware → proxy)
```
