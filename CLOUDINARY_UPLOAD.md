# Cloudinary Upload Guide

## Resumo
Todos os vídeos e imagens foram comprimidos e enviados para o Cloudinary para melhorar o desempenho do site.

## Resultados da Compressão

### Vídeos Comprimidos:
- **emblema.mp4**: 6.9 MB → 1.8 MB (73.9% redução)
- **space.mp4**: 40.67 MB → 3.62 MB (91.1% redução) ✨
- **terranoite.mp4**: 24.27 MB → 1.92 MB (92.1% redução) ✨
- **Terraespaco.mp4**: 47.02 MB → 2.76 MB (94.1% redução) ✨
- **nossalideranca.mp4**: 29.45 MB → 1.62 MB (94.5% redução) ✨
- **historia1.mp4**: 14.49 MB → 1.26 MB (91.3% redução)
- **historia2.mp4**: 17.95 MB → 1.35 MB (92.5% redução)
- **desafioespacial.mp4**: 3.49 MB → 1.28 MB (63.4% redução)
- **galaxyespiral.mp4**: 8.93 MB → 2.46 MB (72.5% redução)
- **planetaagua.mp4**: 7.09 MB → 1.86 MB (73.7% redução)
- **ideiaforword.mp4**: 3 MB → 1.07 MB (64.2% redução)
- **metodology.mp4**: 9.84 MB → 2.62 MB (73.4% redução)
- **historia3.mp4**: 749 KB → 392 KB (47.6% redução)

**Total economizado**: ~180 MB → ~25 MB (86% de redução!)

### Imagens Enviadas:
Todas as 32 imagens foram enviadas com otimização automática de qualidade e formato.

## Como Usar

### 1. Comprimir Vídeos
```bash
npm run compress:videos
```

### 2. Fazer Upload para Cloudinary
```bash
npm run upload:cloudinary
```

### 3. Ativar Cloudinary (já está ativado)
No arquivo `.env.local`:
```
NEXT_PUBLIC_USE_CLOUDINARY=true
```

## Comandos Disponíveis

- `npm run compress:videos` - Comprime todos os vídeos usando FFmpeg
- `npm run upload:cloudinary` - Faz upload de vídeos e imagens para o Cloudinary

## Configuração

O sistema usa automaticamente vídeos comprimidos quando disponíveis em `public/assets/compressed/`.

### Cloudinary Settings:
- **Quality**: auto (otimização automática)
- **Format**: auto (WebP/AVIF quando suportado)
- **Folder**: ideiaspace/

## Benefícios

✅ **Desempenho**: Vídeos 86% menores  
✅ **Qualidade**: Otimização automática baseada no dispositivo  
✅ **CDN**: Entrega rápida globalmente  
✅ **Formatos Modernos**: WebP/AVIF para imagens quando suportado  
✅ **Streaming**: Vídeos com adaptive bitrate
