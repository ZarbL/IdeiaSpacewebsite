# 🚀 Guia de Deploy na Vercel - IdeiaSpace

## ⚠️ Problema: Assets Grandes (Logo e Vídeos)

Seu projeto tem **475MB de assets**, incluindo vídeos grandes que precisam do Git LFS.

## ✅ Solução: Configurar Git LFS na Vercel

### Passo 1: Verificar Git LFS Localmente

```bash
# Verificar se Git LFS está instalado
git lfs version

# Se não estiver instalado (macOS)
brew install git-lfs
git lfs install
```

### Passo 2: Garantir que os Arquivos Estão no LFS

```bash
# Verificar arquivos no LFS
git lfs ls-files

# Adicionar arquivos ao LFS se necessário
git lfs track "*.mp4"
git lfs track "*.MP4"
```

### Passo 3: Fazer Push com LFS

```bash
# Adicionar mudanças
git add .
git commit -m "Configure assets for Vercel deployment"

# Push incluindo arquivos LFS
git push origin main
```

### Passo 4: Configurar Vercel

1. **Acesse seu projeto na Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Vá em Settings → Git**
   - Ative "Git LFS" (Large File Storage)
   - A opção já está configurada no `vercel.json`

3. **Redeploy**
   - Vá em "Deployments"
   - Clique nos 3 pontinhos do último deployment
   - Clique em "Redeploy"

### Passo 5: Verificar Build Logs

Se ainda houver problemas, verifique os logs de build:
- Procure por erros de "file not found" ou "404"
- Verifique se os arquivos LFS foram baixados corretamente

## 🔄 Alternativa: Hospedar Vídeos Externamente

Se o Git LFS não funcionar ou exceder limites da Vercel:

### Opções de CDN/Storage:

1. **Cloudinary** (Recomendado para vídeos)
   - Free tier: 25 GB storage
   - https://cloudinary.com

2. **AWS S3 + CloudFront**
   - Pay as you go
   - Muito escalável

3. **Vercel Blob Storage**
   - Integrado com Vercel
   - https://vercel.com/docs/storage/vercel-blob

### Implementar CDN Externo:

1. Fazer upload dos vídeos para o CDN
2. Atualizar as URLs nos componentes:

```tsx
// Antes
<source src="/assets/ideiaforword.mp4" type="video/mp4" />

// Depois
<source src="https://seu-cdn.com/ideiaforword.mp4" type="video/mp4" />
```

## 📊 Tamanho dos Arquivos

```
Total: 475MB
Vídeos maiores:
- galaxyespiral.mp4: 161MB
- metodology.mp4: 104MB
- Terraespaco.mp4: 47MB
- space.mp4: 41MB
- nossalideranca.mp4: 29MB
```

## 🎯 Recomendação

Para melhor performance:

1. **Use Git LFS** para development
2. **Migre para CDN** para production
3. **Otimize vídeos** (comprima sem perder qualidade)

## 🔧 Comandos Úteis

```bash
# Verificar tamanho do repositório
git lfs ls-files --size

# Comprimir vídeos (usando ffmpeg)
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 23 output.mp4

# Verificar deploy da Vercel
vercel --prod
```

## 📞 Suporte

Se continuar tendo problemas:
1. Verifique os logs na Vercel Dashboard
2. Contate suporte da Vercel sobre limites de Git LFS
3. Considere usar Vercel Blob Storage

