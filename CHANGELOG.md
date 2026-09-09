# Changelog

## [Não lançado]

### Adicionado

- CI/CD (GitHub Actions): `CI` (lint · typecheck · testes+cobertura · build),
  `Fuzz`, `CodeQL`, `Security` (dependency-review · npm audit · gitleaks),
  `Deploy` (Vercel, atrás de CI verde).
- Testes (Vitest + Testing Library + jsdom):
  - `lib/cloudinary` (montagem de URL, toggle Cloudinary)
  - `controllers/home.controller`
  - `api/contact` — integração, incl. teste de não-injeção de HTML
  - `api/satellites` — integração (cache, fallback, TLE inválido)
  - paridade dos `messages/*.json`
  - fuzzing (fast-check) de `cloudinary` e `api/contact`
- `CONTRIBUTING.md`, `SECURITY.md`, `docs/CI-CD.md`, `docs/BACKLOG.md`,
  templates de issue/PR, `CODEOWNERS`, `.editorconfig`.

### Corrigido

- `api/contact`: campos do usuário eram interpolados **sem escape** no HTML do
  email (injeção de HTML/phishing). Agora escapados; adiciona limite de tamanho
  e validação de tipo.
- `api/contact`: `new Resend()` no nível do módulo quebrava o `next build` sem
  `RESEND_API_KEY` — passa a instanciar sob demanda.
- `ResourceCard`: componente `CardContent` era criado durante o render
  (remontava a subárvore a cada render) — vira um elemento JSX.
- `messages`: `pt.json` estava sem 14 chaves (`services.whatIsChallenge`,
  testemunhos placeholder). Paridade restaurada; placeholders removidos.

### Alterado

- ESLint ignora `scripts/**` (scripts Node de build) e `*.config.*`;
  `no-explicit-any` vira warning (débito pré-existente, issue aberta).
