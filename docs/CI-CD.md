# CI/CD

Projeto Next.js único (sem monorepo). Deploy na **Vercel** (Git integration
publica em push para `main`, região `gru1`).

## Workflows (`.github/workflows/`)

| Arquivo | Gatilho | O que faz |
|---|---|---|
| `ci.yml` | push (`main`/`dev`) · PR · manual | `npm ci` · `lint` · `typecheck` (`tsc --noEmit`) · testes + cobertura · `next build` |
| `fuzz.yml` | PR + cron diário (04:00 UTC) | fast-check em `lib/cloudinary` e `api/contact`; passe fundo à noite (`FUZZ_RUNS=3000`); abre issue se o run agendado falhar |
| `codeql.yml` | push/PR + cron semanal | análise estática JS/TS (repo público → Code scanning grátis) |
| `security.yml` | push/PR + cron semanal | `dependency-review` (PR) · `npm audit` (informativo) · gitleaks |
| `deploy.yml` | push em `main` · manual | espera o check **Lint · typecheck · test · build** verde no mesmo SHA → deploy Vercel → smoke test |

## Secrets / variables (opcionais)

| Nome | Tipo | Para quê |
|---|---|---|
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | secret | deploy via Vercel CLI no `deploy.yml`. Sem eles, a Git integration da Vercel já cobre o deploy — o job vira no-op. |
| `SITE_URL` | variable | URL para o smoke test (default `https://ideiaspace.com.br`) |

Env de runtime (na Vercel, não no CI): `RESEND_API_KEY`, `N2YO_API_KEY`,
`SPACETRACK_USERNAME`, `SPACETRACK_PASSWORD`, `NEXT_PUBLIC_USE_CLOUDINARY`.
O build no CI roda sem elas de propósito — o código tem fallback.

## Branch protection sugerida para `main`

Exigir PR + o check **Lint · typecheck · test · build**; branch atualizada
antes do merge; sem push direto.
