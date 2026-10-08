# IdeiaSpace — Website Institucional

Site institucional da **IdeiaSpace**, empresa de educação espacial que leva estudantes da concepção de uma missão espacial até o lançamento de satélites do tipo PocketQube, por meio do programa **Desafio Espacial**.

O site apresenta o programa, as missões desenvolvidas por estudantes, recursos educacionais, a equipe e os parceiros, e oferece um formulário de contato. Está disponível em **inglês, português e espanhol**.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Páginas e rotas](#páginas-e-rotas)
- [APIs](#apis)
- [Internacionalização](#internacionalização)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes e qualidade](#testes-e-qualidade)
- [Build e deploy](#build-e-deploy)
- [Documentação](#documentação)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) com App Router e React Compiler |
| UI | [React 19](https://react.dev/) |
| Linguagem | [TypeScript 5](https://www.typescriptlang.org/) (`strict`) |
| Estilo | [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/postcss`, sem `tailwind.config`; importado em `src/app/globals.css`), CSS Modules e CSS por componente |
| Internacionalização | [next-intl 4](https://next-intl.dev/) |
| Mídia | [Cloudinary](https://cloudinary.com/) como CDN opcional de imagens e vídeos; Git LFS para os vídeos do repositório |
| E-mail | [Resend](https://resend.com/), usado pelo formulário de contato |
| Dados orbitais | Space-Track.org e N2YO, consultados pela API `/api/satellites` |
| Testes | Vitest, Testing Library, jsdom, fast-check |
| Qualidade | ESLint 9 (`eslint-config-next`), `tsc --noEmit` |
| Hospedagem e CI | Vercel e GitHub Actions |

As versões exatas estão no `package-lock.json`.

---

## Requisitos

- **Node.js 20** (versão fixada em [`.nvmrc`](.nvmrc); o Next.js 16 exige `>=20.9.0`)
- **npm** (o projeto usa `package-lock.json`)
- **Git LFS**: os vídeos (`*.mp4`) são versionados com LFS
- **FFmpeg** (opcional): apenas para `npm run compress:videos`

Nenhuma conta em serviço externo é necessária para rodar o projeto localmente. Sem credenciais, as APIs usam respostas de fallback (veja [APIs](#apis)).

---

## Instalação e execução local

```bash
# 1. Clonar o repositório e baixar os vídeos do Git LFS
git clone https://github.com/ZarbL/IdeiaSpacewebsite.git
cd IdeiaSpacewebsite
git lfs install
git lfs pull

# 2. Instalar as dependências (versões do package-lock.json)
npm ci

# 3. (Opcional) configurar variáveis de ambiente
cp .env.example .env.local

# 4. Rodar em desenvolvimento
npm run dev
```

Abra <http://localhost:3000>. A raiz redireciona para `/en`, `/pt` ou `/es` conforme o idioma do navegador.

> **Vídeos em ambiente local:** com a configuração padrão, as URLs de vídeo apontam para `/assets/<nome>.mp4`, mas os arquivos ficam em `public/assets/compressed/`. Por isso os vídeos não carregam localmente. Para vê-los, defina `NEXT_PUBLIC_USE_CLOUDINARY=true` no `.env.local` e reinicie o `npm run dev`. Detalhes em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md#8-pipeline-de-mídia).

---

## Variáveis de ambiente

Todas são opcionais. O modelo completo, com comentários, está em [`.env.example`](.env.example).

| Variável | Tipo | Para quê | Sem ela |
|---|---|---|---|
| `NEXT_PUBLIC_USE_CLOUDINARY` | Pública | `"true"` serve imagens e vídeos mapeados pelo Cloudinary | Caminhos locais `/assets/...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Pública | Conta Cloudinary usada nas URLs e no script de upload | Valor padrão definido em `src/lib/cloudinary.ts` |
| `RESEND_API_KEY` | Servidor | Envio real do e-mail do formulário de contato | Resposta com link `mailto:` |
| `N2YO_API_KEY` | Servidor | TLEs dos grupos `stations`, `starlink` e `weather` | TLEs estáticos de fallback |
| `SPACETRACK_USERNAME` / `SPACETRACK_PASSWORD` | Servidor | TLEs do grupo `ideiaspace` | TLEs estáticos de fallback |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Script local | Apenas para `npm run upload:cloudinary` | O script não consegue enviar |

**Atenção às variáveis `NEXT_PUBLIC_*`:** elas vão para o código enviado ao navegador (nunca coloque segredos nelas). Como as páginas são geradas no build, o valor usado é o que existia **no momento do build**: alterar a variável depois exige um novo build (ou reiniciar o `npm run dev`).

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção (requer `build` antes) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação de tipos (`tsc --noEmit`) |
| `npm test` | Vitest em modo watch |
| `npm run test:run` | Todos os testes, uma vez |
| `npm run test:ci` | Testes com relatório de cobertura |
| `npm run test:fuzz` | Apenas os testes de fuzzing (`*.fuzz.test.ts`) |
| `npm run compress:videos` | Comprime vídeos de `public/assets/` para `public/assets/compressed/` com FFmpeg |
| `npm run upload:cloudinary` | Envia vídeos e imagens para o Cloudinary (requer credenciais em `.env.local`) |

O `package.json` também declara `upload:large`, mas o arquivo que ele executa (`scripts/upload-large-videos.js`) não existe no repositório.

---

## Páginas e rotas

Todas as páginas têm prefixo de idioma (`/en`, `/pt`, `/es`).

| Rota | Conteúdo | Item do menu (pt) |
|---|---|---|
| `/` | Redireciona para o idioma detectado | — |
| `/{locale}` | Página inicial: apresentação, números, Desafio, Missões, Recursos e contato (`#contact`) | Início |
| `/{locale}/about` | História, missão/visão/valores, parceiros e liderança | Sobre Nós |
| `/{locale}/missions` | Missões desenvolvidas por estudantes | Missões |
| `/{locale}/services` | Programa Desafio Espacial: fases, metodologia e depoimentos | **Desafio** |
| `/{locale}/technologies` | Recursos educacionais | **Recursos** |
| `/{locale}/teacher-resources` | Página provisória de recursos para professores | (não aparece no menu) |

O menu também tem dois links externos: **Programação** (`ideia-spacetoweb.vercel.app`) e **Nossos Satélites** (`tleideiaspaceview.vercel.app`).

Mais detalhes, incluindo o comportamento para URLs com idioma não suportado, em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md#9-mapa-de-rotas).

---

## APIs

| Endpoint | Método | Descrição | Sem credenciais |
|---|---|---|---|
| `/api/contact` | `POST` | Recebe o formulário de contato e envia o e-mail via Resend | Responde com um link `mailto:` |
| `/api/satellites` | `GET` | Proxy de dados orbitais (TLE) do Space-Track e da N2YO, com cache em memória | Responde com TLEs estáticos |

O formulário de contato da página inicial usa `/api/contact`. `/api/satellites` não é chamada pelas páginas deste repositório; ela é exposta via HTTP.

Contratos, respostas e cabeçalhos: [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md).

---

## Internacionalização

- Idiomas: **`en`** (padrão), **`pt`** e **`es`**.
- Ao acessar `/`, o idioma é escolhido pelo cookie `NEXT_LOCALE` ou pelo `Accept-Language` do navegador. Se nenhum for suportado, usa `en`.
- Os textos ficam em [`messages/`](messages) (`en.json`, `pt.json`, `es.json`), com as mesmas chaves nos três arquivos (verificado por teste).
- Configuração: `src/routing.ts` (idiomas), `src/proxy.ts` (middleware), `src/i18n.ts` (carregamento das mensagens).

```tsx
// Server Component
const t = await getTranslations('about');

// Client Component
const t = useTranslations('nav');
```

Para adicionar um idioma, é preciso alterar `src/routing.ts`, o `matcher` em `src/proxy.ts`, criar `messages/<idioma>.json` e incluir o idioma no seletor de `src/components/Header.tsx`.

---

## Estrutura do projeto

```
├── .github/workflows/     # CI, fuzz, CodeQL, segurança e deploy
├── docs/                  # Documentação técnica (arquitetura, CI/CD, backlog)
├── messages/              # Traduções: en.json, pt.json, es.json
├── public/
│   └── assets/            # Imagens
│       └── compressed/    # Vídeos (.mp4, Git LFS)
├── scripts/               # Scripts de mídia: compressão, upload ao Cloudinary, favicon
├── src/
│   ├── app/
│   │   ├── [locale]/      # Páginas (home, about, missions, services, technologies, teacher-resources)
│   │   ├── api/           # Route Handlers: contact, satellites
│   │   ├── layout.tsx     # Layout raiz
│   │   └── globals.css    # Tailwind e estilos globais
│   ├── components/        # Componentes de interface (Header, Footer, ContactForm, carrosséis, cards)
│   ├── views/sections/    # Seções da página inicial
│   ├── controllers/       # HomeController (conteúdo da página inicial)
│   ├── models/            # Tipos do conteúdo da página inicial
│   ├── lib/               # cloudinary.ts (URLs de mídia) e utilitários
│   ├── i18n.ts            # Carregamento das traduções
│   ├── routing.ts         # Idiomas suportados
│   └── proxy.ts           # Middleware de idioma (next-intl)
├── .env.example           # Modelo de variáveis de ambiente
├── next.config.ts         # Configuração do Next.js (imagens, cabeçalhos, next-intl)
├── vercel.json            # Configuração da Vercel
└── vitest.config.ts       # Configuração dos testes
```

As pastas `controllers/`, `models/` e `views/` são usadas apenas pela página inicial. As demais páginas montam seus componentes diretamente. Uma visão completa das responsabilidades está em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md#2-estrutura-arquitetural).

---

## Testes e qualidade

```bash
npm run lint && npm run typecheck && npm run test:ci && npm run build
```

Os testes ficam em pastas `__tests__/` ao lado do código e cobrem as APIs (com Resend e `fetch` simulados), o helper de mídia `src/lib/cloudinary.ts`, o `HomeController` e a paridade das traduções. Não há testes de componentes nem testes end-to-end.

---

## Build e deploy

- `npm run build` gera as páginas de forma estática: 6 rotas × 3 idiomas = 18 páginas. As duas APIs rodam sob demanda.
- O build funciona **sem nenhuma variável de ambiente**; é assim que o CI o executa.
- [`vercel.json`](vercel.json): framework Next.js, região `gru1`, deploy automático da branch `main` e Git LFS habilitado.
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): em push para `main`, aguarda o CI e faz o deploy pela Vercel CLI **se** o secret `VERCEL_TOKEN` estiver configurado; sem ele, a etapa de deploy é pulada. Em seguida executa um smoke test (requisição HTTP à URL do site).
- Para usar o Cloudinary no site publicado, `NEXT_PUBLIC_USE_CLOUDINARY=true` precisa estar disponível **durante o build** na Vercel.

Workflows, secrets e proteção de branch: [`docs/CI-CD.md`](docs/CI-CD.md).

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/GUIA_OPERACIONAL.md`](docs/GUIA_OPERACIONAL.md) | Setup detalhado, comandos, rotina de desenvolvimento, deploy e troubleshooting |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | Arquitetura, ciclo de requisição, i18n, build, mídia, rotas e limites conhecidos |
| [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) | Contrato de `/api/contact` e `/api/satellites` |
| [`docs/CI-CD.md`](docs/CI-CD.md) | Workflows do GitHub Actions e deploy |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Fluxo de contribuição, branches e testes |
| [`SECURITY.md`](SECURITY.md) | Como reportar vulnerabilidades |
| [`CHANGELOG.md`](CHANGELOG.md) | Histórico de mudanças |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Issues abertas do code review e situação de segurança das dependências |

---

## Contribuindo

Branch a partir de `main`, PR para `dev`, Conventional Commits e CI verde antes do merge. A `dev` acumula as mudanças, que vão para produção quando `dev` é mesclada em `main`. O GitHub não impõe essas regras (as branches não têm proteção) e sugere `main` como base do PR: troque para `dev`. Hoje `dev` está atrás de `main`. A situação das branches e os detalhes estão em [`CONTRIBUTING.md`](CONTRIBUTING.md#fluxo).

Falhas de segurança não devem ser abertas como issue pública: siga [`SECURITY.md`](SECURITY.md).

---

## Licença

Este projeto é propriedade da **IdeiaSpace**. Todos os direitos reservados.
