# Política de Segurança

## Reportar

O repositório é **público**. Não abra issue pública para falhas de segurança —
use os [Security Advisories](https://github.com/ZarbL/IdeiaSpacewebsite/security/advisories/new)
do GitHub ou contato@ideiaspace.com.br.

## Superfície

- **`src/app/api/contact`** — recebe o formulário e envia email via Resend. Os
  campos são validados (tipo, tamanho, formato de email) e **escapados** antes
  de entrar no HTML do email. Falta rate limiting (issue aberta).
- **`src/app/api/satellites`** — proxy de TLEs (Space-Track / N2YO) com cache em
  memória e fallback estático. As credenciais ficam só no servidor.
- **Segredos**: apenas variáveis de ambiente (`RESEND_API_KEY`, `N2YO_API_KEY`,
  `SPACETRACK_*`). Nada versionado. `NEXT_PUBLIC_*` vai para o bundle — nunca
  colocar segredo aí.
- **Headers**: `next.config.ts` define `X-Content-Type-Options`, `Referrer-Policy`
  e `Content-Security-Policy: frame-ancestors *` (embedding liberado — issue
  aberta para restringir aos domínios reais).
