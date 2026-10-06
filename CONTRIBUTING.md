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

1. Branch a partir de `dev`: `feat/...`, `fix/...`, `chore/...`.
2. Conventional Commits (`feat:`, `fix:`, `docs:`…).
3. Antes do PR:
   ```bash
   npm run lint && npm run typecheck && npm run test:ci && npm run build
   ```
4. PR para `dev`; CI verde obrigatório. `dev` → `main` quando for para produção
   (a Vercel publica em push para `main`).

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
