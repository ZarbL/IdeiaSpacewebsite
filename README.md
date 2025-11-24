# IdeiaSpace Website

Site institucional da IdeiaSpace construído com Next.js, React e next-intl para internacionalização.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com SSR e SSG
- **React 19** - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **next-intl** - Internacionalização (i18n)
- **ESLint** - Linter para código limpo

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Estrutura do Projeto

```
ideaspace-website/
├── src/
│   ├── app/
│   │   ├── [locale]/        # Rotas internacionalizadas
│   │   │   ├── page.tsx     # Página inicial
│   │   │   ├── services/    # Página Serviços
│   │   │   ├── contact/     # Página Contato
│   │   │   └── layout.tsx   # Layout com i18n
│   │   └── globals.css      # Estilos globais
│   ├── components/          # Componentes React
│   │   ├── Header.tsx       # Cabeçalho com dropdown de idiomas
│   │   └── Footer.tsx       # Rodapé
│   ├── i18n.ts              # Configuração i18n
│   └── messages/            # Traduções (en.json, pt.json, es.json)
├── public/                  # Arquivos estáticos
│   └── assets/              # Imagens e vídeos
├── tailwind.config.ts       # Configuração Tailwind
└── package.json             # Dependências
```

## 🌐 Internacionalização

Suporta 3 idiomas:
- 🇺🇸 English (en)
- 🇧🇷 Português (pt)
- 🇪🇸 Español (es)

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
2. Deploy automático!

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
