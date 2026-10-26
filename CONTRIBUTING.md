# Contribuindo

Site institucional da IdeiaSpace — **Next.js 16 (App Router) + React 19**,
`next-intl` (pt/en/es), Three.js / react-globe.gl, Cloudinary para mídia,
Resend para o formulário de contato. Sem backend próprio: as duas rotas
server-side vivem em `src/app/api/` e rodam como funções na Vercel.

## Setup

```bash
npm ci
npm run dev        # http://localhost:3000
```

Variáveis de ambiente (todas opcionais — há fallback):

| var | para quê | sem ela |
|---|---|---|
| `RESEND_API_KEY` | envio real do formulário de contato | cai para `mailto:` |
| `NEXT_PUBLIC_USE_CLOUDINARY` | servir vídeo/imagem do Cloudinary | `/assets/` local |

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

Cobrimos hoje: `lib/cloudinary`, `controllers/home.controller`, a rota
`api/contact` (integração, com `resend` mockado) e a
paridade dos arquivos de tradução (`messages/*.json`).

## Estrutura

```
src/
├── app/[locale]/     # páginas (App Router, segmento de locale)
├── app/api/          # rotas server-side (contact)
├── components/       # componentes de UI
├── views/sections/   # seções de página compostas
├── controllers/      # montagem de conteúdo a partir das traduções
├── models/           # tipos de conteúdo
├── lib/              # cloudinary, wordpress, assets
└── proxy.ts          # middleware do next-intl (Next 16 renomeou middleware → proxy)
```
