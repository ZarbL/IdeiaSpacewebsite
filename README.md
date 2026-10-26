# 🚀 IdeiaSpace - Website Institucional

Site institucional da **IdeiaSpace**, plataforma educacional que conecta o espaço à sala de aula através do **Desafio Espacial**. O projeto transforma alunos em protagonistas, levando-os desde a concepção de uma missão espacial até o lançamento de satélites reais em órbita.

Este website multilíngue apresenta as missões espaciais desenvolvidas pelos alunos, recursos educacionais para professores, tecnologias utilizadas e toda a jornada educacional proporcionada pelo programa.

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Páginas e Rotas](#-páginas-e-rotas)
- [Componentes Principais](#-componentes-principais)
- [Internacionalização](#-internacionalização)
- [Integrações](#-integrações)
- [Deploy](#-deploy)
- [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Sobre o Projeto

O site IdeiaSpace é uma plataforma web moderna que apresenta:

- **Desafio Espacial**: Projeto educacional que conecta estudantes ao programa espacial
- **Missões Reais**: Apresentação de satélites desenvolvidos por alunos (UAI-SAT, SARI-1, etc.)
- **Recursos Educacionais**: Materiais e ferramentas para professores e educadores
- **Tecnologias Espaciais**: Stack tecnológico usado nas missões espaciais
- **Impacto Global**: Estatísticas de satélites lançados, estudantes impactados e países alcançados

---

## 🛠 Tecnologias

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router, SSR e SSG
- **[React 19](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática

### Estilização
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **CSS Modules** - Estilos CSS escopados por componente
- **PostCSS** - Processamento e otimização de CSS

### Internacionalização (i18n)
- **[next-intl 4.5](https://next-intl-docs.vercel.app/)** - Internacionalização completa com suporte a 3 idiomas
- Rotas dinâmicas `[locale]` para mudança de idioma
- Traduções estruturadas em JSON

### Mídia e Assets
- **[Cloudinary](https://cloudinary.com/)** - CDN e gerenciamento de mídia (imagens e vídeos)
- **[next-cloudinary 6.17](https://next-cloudinary.dev/)** - Integração Next.js com Cloudinary
- Compressão e otimização automática de vídeos

### Comunicação
- **[Resend 6.5](https://resend.com/)** - Serviço de envio de emails transacionais
- API Route para formulário de contato

### Qualidade de Código
- **[ESLint 9](https://eslint.org/)** - Linter para manter código limpo e padronizado
- **eslint-config-next** - Configuração ESLint otimizada para Next.js
- **Babel React Compiler** - Compilador experimental do React

### DevOps
- **[Vercel](https://vercel.com/)** - Plataforma de deploy e hospedagem
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## ✨ Funcionalidades

### 🌍 Multilíngue
- Suporte completo para 3 idiomas: Português (pt), Inglês (en) e Espanhol (es)
- Troca de idioma em tempo real
- URLs localizadas para SEO

### 📱 Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Scroll snap para experiência imersiva
- Animações e transições suaves

### 🎥 Mídia Otimizada
- Vídeos hospedados no Cloudinary com CDN global
- Lazy loading de imagens e vídeos
- Compressão automática de assets

### 📊 Componentes Interativos
- Carrosséis dinâmicos (missões, tecnologias, depoimentos, etc.)
- Contadores animados de estatísticas
- Cards de liderança e equipe
- Formulário de contato com validação

### 🎨 Seções do Site
- **Hero Section**: Vídeo de apresentação e call-to-action
- **Stats Counter**: Estatísticas de impacto (satélites, estudantes, países)
- **Ideia to Space**: Jornada educacional do programa
- **Challenge Section**: Apresentação do Desafio Espacial
- **Missions Section**: Showcase das missões dos alunos
- **Technologies Section**: Stack tecnológico usado
- **Leadership Cards**: Equipe e liderança
- **Contact Form**: Formulário integrado com Resend

---

## 📁 Estrutura do Projeto

```
ideaspace-website/
├── public/                          # Arquivos estáticos
│   └── assets/
│       └── compressed/             # Vídeos comprimidos
│
├── src/
│   ├── app/                        # App Router do Next.js
│   │   ├── [locale]/              # Rotas internacionalizadas
│   │   │   ├── page.tsx           # 🏠 Página inicial
│   │   │   ├── layout.tsx         # Layout com i18n
│   │   │   ├── about/             # 📖 Sobre nós
│   │   │   ├── missions/          # 🛰️ Missões espaciais
│   │   │   ├── services/          # 🔧 Serviços
│   │   │   ├── teacher-resources/ # 📚 Recursos educacionais
│   │   │   └── technologies/      # 💻 Tecnologias
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts       # API de contato
│   │   ├── globals.css            # Estilos globais
│   │   └── layout.tsx             # Root layout
│   │
│   ├── components/                 # Componentes React
│   │   ├── Header.tsx             # Cabeçalho com navegação
│   │   ├── Footer.tsx             # Rodapé
│   │   ├── ContactForm.tsx        # Formulário de contato
│   │   ├── WhatsAppButton.tsx     # Botão flutuante WhatsApp
│   │   │
│   │   ├── *Carousel.tsx          # Diversos carrosséis:
│   │   │   ├── AboutCarousel.tsx        # Sobre nós
│   │   │   ├── BenefitsCarousel.tsx     # Benefícios
│   │   │   ├── HistoryCarousel.tsx      # História
│   │   │   ├── MVVCarousel.tsx          # Missão/Visão/Valores
│   │   │   ├── MissionBadges.tsx        # Badges de missões
│   │   │   ├── MethodologyCarousel.tsx  # Metodologia
│   │   │   ├── PartnersCarousel.tsx     # Parceiros
│   │   │   ├── PhasesCarousel.tsx       # Fases do projeto
│   │   │   ├── StatsCarousel.tsx        # Estatísticas
│   │   │   └── TestimonialsCarousel.tsx # Depoimentos
│   │   │
│   │   ├── StatsCounter.tsx       # Contador de estatísticas
│   │   ├── LeadershipCard.tsx     # Card de liderança
│   │   ├── TechnologyCard.tsx     # Card de tecnologia
│   │   ├── TestimonialCard.tsx    # Card de depoimento
│   │   ├── ResourceCard.tsx       # Card de recurso
│   │   ├── SocialMediaCard.tsx    # Card de mídia social
│   │   ├── EcosystemCard.tsx      # Card de ecossistema
│   │   ├── ImpactCards.tsx        # Cards de impacto
│   │   ├── JourneyCard.tsx        # Card de jornada
│   │   │
│   │   ├── CloudinaryVideo.tsx    # Vídeo do Cloudinary
│   │   ├── OptimizedVideo.tsx     # Vídeo otimizado
│   │   ├── SlowVideo.tsx          # Vídeo em slow motion
│   │   ├── AnimatedPattern.tsx    # Padrões animados
│   │   ├── ScrollIndicator.tsx    # Indicador de scroll
│   │   └── InfoCard.tsx           # Card de informação
│   │
│   ├── views/
│   │   └── sections/              # Seções da página
│   │       ├── HeroSection.tsx           # Seção hero
│   │       ├── ChallengeSection.tsx      # Seção desafio
│   │       ├── MissionsSection.tsx       # Seção missões
│   │       ├── TechnologiesSection.tsx   # Seção tecnologias
│   │       ├── IdeiaToSpaceSection.tsx   # Seção ideia→espaço
│   │       └── CTASection.tsx            # Call-to-action
│   │
│   ├── controllers/
│   │   └── home.controller.ts     # Controlador da home (MVC)
│   │
│   ├── models/
│   │   └── content.model.ts       # Modelo de conteúdo
│   │
│   ├── lib/                       # Utilitários
│   │   ├── cloudinary.ts         # Helper Cloudinary
│   │   └── assets.ts             # Helper de assets
│   │
│   ├── i18n.ts                   # Configuração i18n
│   ├── routing.ts                # Configuração de rotas
│   └── proxy.ts                  # Configuração de proxy
│
├── messages/                     # Traduções
│   ├── pt.json                  # 🇧🇷 Português
│   ├── en.json                  # 🇺🇸 Inglês
│   └── es.json                  # 🇪🇸 Espanhol
│
├── scripts/                      # Scripts utilitários
│   ├── compress-videos.js       # Compressão de vídeos
│   └── upload-to-cloudinary.js  # Upload para Cloudinary
│
├── next.config.ts               # Configuração Next.js
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
├── eslint.config.mjs            # Configuração ESLint
├── postcss.config.mjs           # Configuração PostCSS
├── vercel.json                  # Configuração Vercel
├── package.json                 # Dependências
│
├── CLOUDINARY_UPLOAD.md         # 📖 Doc: Upload Cloudinary
├── RESEND_SETUP.md              # 📖 Doc: Setup Resend
└── DEPLOY_GUIDE.md              # 📖 Doc: Guia de Deploy
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn** ou **pnpm**
- Conta no **[Cloudinary](https://cloudinary.com/)** (para mídia)
- Conta no **[Resend](https://resend.com/)** (para emails)
- **Git** para controle de versão

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/IdeiaSpace/IdeiaSite.git
cd ideaspace-website
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Resend (Email)
RESEND_API_KEY=sua_resend_api_key
RESEND_FROM_EMAIL=contato@ideispace.com

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 4. Execute em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## ⚙️ Configuração

### Cloudinary

Para configurar o upload de mídia no Cloudinary, siga o guia completo em **[CLOUDINARY_UPLOAD.md](./CLOUDINARY_UPLOAD.md)**.

```bash
# Comprimir vídeos
npm run compress:videos

# Upload para Cloudinary
npm run upload:cloudinary
```

### Resend (Email)

Para configurar o envio de emails via Resend, consulte **[RESEND_SETUP.md](./RESEND_SETUP.md)**.

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (http://localhost:3000)

# Produção
npm run build            # Build otimizado para produção
npm start                # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint

# Mídia
npm run compress:videos  # Comprime vídeos para web
npm run upload:cloudinary # Faz upload de mídia para Cloudinary
```

---

## 🗺️ Páginas e Rotas

Todas as rotas são internacionalizadas com o prefixo `[locale]`:

| Rota                        | Descrição                          |
|-----------------------------|------------------------------------|
| `/`                         | Redireciona para idioma padrão     |
| `/pt`, `/en`, `/es`         | Página inicial                     |
| `/{locale}/about`           | Sobre nós (equipe, história, MVV)  |
| `/{locale}/missions`        | Missões espaciais dos alunos       |
| `/{locale}/services`        | Serviços oferecidos                |
| `/{locale}/teacher-resources` | Recursos para professores        |
| `/{locale}/technologies`    | Tecnologias utilizadas             |

### API Routes

| Endpoint              | Método | Descrição                    |
|-----------------------|--------|------------------------------|
| `/api/contact`        | POST   | Envio de formulário contato  |

---

## 🧩 Componentes Principais

### Layout
- **Header**: Navegação multilíngue com dropdown de idiomas
- **Footer**: Links, redes sociais e informações de contato
- **WhatsAppButton**: Botão flutuante de contato via WhatsApp

### Carrosséis
- **AboutCarousel**: História e evolução da IdeiaSpace
- **MissionBadges**: Showcase de missões dos alunos (UAI-SAT, SARI-1)
- **TechnologyCard**: Stack tecnológico usado nas missões
- **TestimonialsCarousel**: Depoimentos de alunos e professores
- **PartnersCarousel**: Parceiros e colaboradores

### Seções Principais
- **HeroSection**: Vídeo hero com CTA
- **StatsCounter**: Contador animado de estatísticas
- **IdeiaToSpaceSection**: Jornada educacional
- **ChallengeSection**: Apresentação do Desafio Espacial
- **MissionsSection**: Galeria de missões
- **TechnologiesSection**: Tecnologias espaciais

### Formulários
- **ContactForm**: Formulário de contato com validação e integração Resend

---

## 🌐 Internacionalização

O site suporta **3 idiomas** completos:

- 🇧🇷 **Português (pt)** - Idioma padrão
- 🇺🇸 **Inglês (en)**
- 🇪🇸 **Espanhol (es)**

### Estrutura de Traduções

Todas as traduções estão em arquivos JSON na pasta `messages/`:

```json
{
  "nav": { "home": "Início", "about": "Sobre Nós" },
  "hero": { "title": "Bem-vindo ao Ideia Space" },
  "missions": { "title": "Nossas Missões" }
}
```

### Como Usar

```tsx
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations();
  
  return <h1>{t('hero.title')}</h1>;
}
```

### Configuração

A configuração de i18n está em `src/i18n.ts` e usa **next-intl** com:
- Detecção automática de idioma
- URLs localizadas
- Fallback para idioma padrão

---

## 🔌 Integrações

### Cloudinary
- **CDN Global** para entrega rápida de mídia
- **Otimização automática** de imagens e vídeos
- **Transformações dinâmicas** (resize, crop, format)

### Resend
- **Emails transacionais** para formulário de contato
- **Templates personalizados**
- **Tracking de entrega**

### Vercel
- **Deploy automático** via Git
- **Edge Network** global
- **Analytics** e monitoramento

---

## 🚀 Deploy

### Deploy na Vercel (Recomendado)

1. **Conecte o repositório**:
   ```bash
   # Instale a CLI da Vercel
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure as variáveis de ambiente** no painel da Vercel

3. **Deploy automático**: Cada push na branch `main` faz deploy automaticamente

Para instruções detalhadas, consulte **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**.

### Build Manual

```bash
# Build
npm run build

# Teste o build localmente
npm start
```

---

## 📖 Documentação Adicional

- **[CLOUDINARY_UPLOAD.md](./CLOUDINARY_UPLOAD.md)** - Guia completo de upload de mídia
- **[RESEND_SETUP.md](./RESEND_SETUP.md)** - Configuração de emails
- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - Guia de deploy e produção

---

## 🧪 Padrões de Código

### Arquitetura
- **MVC Pattern**: Controllers, Models e Views separados
- **Component-Based**: Componentes reutilizáveis e modulares
- **CSS Modules**: Estilos escopados por componente

### TypeScript
- **Tipagem forte** em todos os arquivos
- **Interfaces** para props de componentes
- **Type safety** nas APIs

### Estrutura de Componentes
```tsx
// Component.tsx
export interface ComponentProps {
  title: string;
  description?: string;
}

export default function Component({ title, description }: ComponentProps) {
  return <div>{title}</div>;
}
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é propriedade da **IdeiaSpace**. Todos os direitos reservados.

---

## 📞 Contato

- **Website**: [www.ideispace.com](https://www.ideispace.com)
- **Email**: contato@ideispace.com
- **WhatsApp**: [Contato via WhatsApp](https://wa.me/seu_numero)

---

## 🎓 Sobre o IdeiaSpace

O **IdeiaSpace** é um projeto educacional inovador que conecta estudantes ao programa espacial brasileiro. Através do **Desafio Espacial**, os alunos:

- 🛰️ Desenvolvem missões espaciais reais
- 🚀 Lançam satélites em órbita (PocketQubes)
- 💻 Programam sensores e sistemas embarcados
- 📊 Analisam dados reais do espaço
- 🌍 Desenvolvem visão global e científica

### Impacto
- **Satélites lançados** em órbita
- **Milhares de estudantes** impactados
- **Presença** em múltiplos países
- **Parcerias** com universidades e agências espaciais

---

<div align="center">
  <strong>Desenvolvido com ❤️ pela equipe IdeiaSpace</strong>
  
  <br/>
  
  🚀 **Do Ideia ao Espaço** 🌌
</div>
