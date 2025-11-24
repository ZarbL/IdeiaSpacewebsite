# IdeiaSpace Website

Site institucional da IdeiaSpace construído com Next.js, React e WordPress Headless CMS.

## 🚀 Tecnologias

Este projeto utiliza as mesmas tecnologias que o site da AST Space Mobile:

- **Next.js 15** - Framework React com SSR e SSG
- **React 19** - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **WordPress (Headless CMS)** - Sistema de gerenciamento de conteúdo
- **ESLint** - Linter para código limpo

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- WordPress instalado (para CMS)

## 🔧 Instalação

1. Clone o repositório (se aplicável)

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Edite o arquivo `.env.local` na raiz do projeto:

```env
WORDPRESS_API_URL=https://seu-wordpress.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=IdeiaSpace
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Estrutura do Projeto

```
ideaspace-website/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── page.tsx        # Página inicial
│   │   ├── about/          # Página Sobre
│   │   ├── services/       # Página Serviços
│   │   ├── contact/        # Página Contato
│   │   ├── layout.tsx      # Layout global
│   │   └── globals.css     # Estilos globais
│   ├── components/         # Componentes React
│   │   ├── Header.tsx      # Cabeçalho
│   │   └── Footer.tsx      # Rodapé
│   └── lib/                # Funções utilitárias
│       └── wordpress.ts    # API WordPress
├── public/                 # Arquivos estáticos
├── .env.local             # Variáveis de ambiente
├── tailwind.config.ts     # Configuração Tailwind
└── package.json           # Dependências
```

## 🌐 Integração com WordPress

Este projeto usa WordPress como Headless CMS. Para configurar:

1. Instale o WordPress em um servidor ou localmente
2. Ative a API REST do WordPress (habilitada por padrão)
3. Configure a URL no `.env.local`
4. Use as funções em `src/lib/wordpress.ts` para buscar conteúdo

### Exemplos de uso:

```typescript
import { getPosts, getPageBySlug } from '@/lib/wordpress';

// Buscar posts
const posts = await getPosts(10);

// Buscar página por slug
const page = await getPageBySlug('about');
```

## 📦 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm start        # Servidor de produção
npm run lint     # ESLint
```

## 🚀 Deploy

Deploy facilmente na [Vercel](https://vercel.com):
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático!

## 📝 Licença

Projeto privado - IdeiaSpace

## 🆘 Suporte

contato@ideiaspace.com


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
