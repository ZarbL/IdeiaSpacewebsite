# Guia Operacional

Manual prático para rodar, testar, publicar e diagnosticar o site da IdeiaSpace. Ele continua de onde o [`README.md`](../README.md) para. Para entender *por que* o sistema funciona assim, veja [`docs/ARQUITETURA.md`](ARQUITETURA.md).

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Setup local passo a passo](#2-setup-local-passo-a-passo)
3. [Configuração do `.env.local`](#3-configuração-do-envlocal)
4. [Comandos do repositório](#4-comandos-do-repositório)
5. [Rotina de desenvolvimento](#5-rotina-de-desenvolvimento)
6. [Deploy e CI/CD](#6-deploy-e-cicd)
7. [Troubleshooting](#7-troubleshooting)
8. [Referências](#8-referências)

---

## 1. Pré-requisitos

| Ferramenta | Versão | Origem | Como conferir |
|---|---|---|---|
| Node.js | **20** (mínimo `20.9.0`) | `.nvmrc` = `20`; o Next.js 16 declara `engines.node >= 20.9.0` | `node -v` |
| npm | o que acompanha o Node | o projeto usa `package-lock.json` | `npm -v` |
| Git | qualquer versão recente | — | `git --version` |
| **Git LFS** | qualquer versão 3.x | `.gitattributes`: `*.mp4 filter=lfs` | `git lfs version` |
| FFmpeg | — | só para `npm run compress:videos` | `ffmpeg -version` |

Observações:

- O CI usa a versão do `.nvmrc` (`node-version-file: .nvmrc`). Com `nvm`, `fnm` ou Volta, basta `nvm use` na raiz do projeto.
- Versões de Node acima de 20 que satisfazem `>=20.9.0` também funcionam localmente (o projeto foi executado com Node 22).
- **O Git LFS é obrigatório para ter os vídeos reais no disco.** Sem ele, cada `.mp4` vira um arquivo de texto de ~130 bytes (ver [7.2](#72-os-arquivos-mp4-têm-130-bytes-git-lfs)).

Nenhuma conta em serviço externo é necessária para rodar, testar e compilar o projeto.

---

## 2. Setup local passo a passo

### 2.1 Clonar com os vídeos

```bash
git lfs install                 # uma vez por máquina: registra os filtros do LFS no Git
git clone https://github.com/ZarbL/IdeiaSpacewebsite.git
cd IdeiaSpacewebsite
git lfs pull                    # garante que os .mp4 foram baixados
```

Confirme:

```bash
git lfs ls-files
# 989ad0c574 * public/assets/compressed/Terraespaco.mp4    ← "*" = arquivo real
# 989ad0c574 - public/assets/compressed/Terraespaco.mp4    ← "-" = só o ponteiro (rode git lfs pull)
```

### 2.2 Instalar dependências

```bash
nvm use        # opcional, se usar nvm
npm ci
```

Use `npm ci` (e não `npm install`) para instalar exatamente as versões do `package-lock.json`, como o CI faz. A instalação leva alguns minutos e exibe avisos de pacotes depreciados e um resumo do `npm audit`. Nada disso impede a instalação nem o funcionamento, mas o resumo do audit não é ruído: ele inclui vulnerabilidades reais e ainda não corrigidas, entre elas duas críticas no `next`. A situação está registrada em [`SECURITY.md`](../SECURITY.md) e em [`docs/BACKLOG.md`](BACKLOG.md#segurança-das-dependências-sem-issue-aberta).

### 2.3 Variáveis de ambiente (opcional)

```bash
cp .env.example .env.local
```

No PowerShell, `cp` também funciona (é um alias de `Copy-Item`).

Com o arquivo copiado sem alterações, o comportamento é o mesmo de não ter `.env.local`. Veja a [seção 3](#3-configuração-do-envlocal) para decidir o que preencher.

### 2.4 Rodar

```bash
npm run dev
```

Abra <http://localhost:3000>. O que deve acontecer:

| Verificação | Esperado |
|---|---|
| `http://localhost:3000/` | Redireciona para `/en`, `/pt` ou `/es` (conforme o navegador) |
| Menu, troca de idioma, imagens | Funcionam |
| Formulário de contato | Responde "Mensagem recebida! Abrindo cliente de email..." e tenta abrir o cliente de e-mail |
| Vídeos | **Não aparecem**, a menos que `NEXT_PUBLIC_USE_CLOUDINARY=true` (ver [7.1](#71-os-vídeos-não-carregam-no-site-local)) |

---

## 3. Configuração do `.env.local`

O modelo completo, com comentários, está em [`.env.example`](../.env.example). Todas as variáveis são opcionais.

| Quero… | Preencha | Observação |
|---|---|---|
| Ver os vídeos localmente | `NEXT_PUBLIC_USE_CLOUDINARY=true` | Não precisa de credencial: usa a CDN pública do Cloudinary |
| Testar envio real do formulário | `RESEND_API_KEY` | Use uma chave **de teste sua**, nunca a de produção |
| Testar dados reais de satélites | `N2YO_API_KEY` e/ou `SPACETRACK_USERNAME` + `SPACETRACK_PASSWORD` | Contas próprias, gratuitas |
| Enviar mídia ao Cloudinary | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Só para `npm run upload:cloudinary`; exige acesso à conta |

Regras de operação:

- **Depois de alterar `.env.local`, reinicie o `npm run dev`.** Para `npm run build`/`npm start`, refaça o build: as variáveis `NEXT_PUBLIC_*` ficam gravadas no HTML no momento do build.
- `.env.local` está no `.gitignore` e **nunca** deve ser commitado. Só o `.env.example` (sem valores) é versionado.
- Nunca coloque segredos em variáveis com prefixo `NEXT_PUBLIC_`: elas vão para o navegador.

---

## 4. Comandos do repositório

### 4.1 Scripts do `package.json`

| Comando | Executa | Para que serve | No CI |
|---|---|---|---|
| `npm run dev` | `next dev` | Servidor de desenvolvimento com recarga automática | — |
| `npm run build` | `next build` | Build de produção: gera as 18 páginas estáticas e prepara as APIs | `ci.yml` |
| `npm start` | `next start` | Serve o build de produção localmente (rode `npm run build` antes) | — |
| `npm run lint` | `eslint` | Regras de código do Next.js/TypeScript. Warnings não reprovam; erros sim | `ci.yml` |
| `npm run typecheck` | `tsc --noEmit` | Verifica os tipos de todo o projeto sem gerar arquivos | `ci.yml` |
| `npm test` | `vitest` | Testes em modo watch (reexecuta ao salvar) | — |
| `npm run test:run` | `vitest run` | Todos os testes, uma vez | — |
| `npm run test:ci` | `vitest run --coverage` | Testes + cobertura (pasta `coverage/`) com limites mínimos | `ci.yml` |
| `npm run test:fuzz` | `vitest run fuzz.test` | Só os arquivos `*.fuzz.test.ts` (fast-check) | `fuzz.yml` |
| `npm run compress:videos` | `node scripts/compress-videos.js` | Comprime `public/assets/<nome>.mp4` para `public/assets/compressed/` | — |
| `npm run upload:cloudinary` | `node scripts/upload-to-cloudinary.js` | Envia vídeos e imagens para a pasta `ideiaspace` do Cloudinary | — |
| `npm run upload:large` | `node scripts/upload-large-videos.js` | **Não funciona:** o arquivo não existe no repositório | — |

### 4.2 Variações úteis

```bash
# Outra porta
npm run dev -- --port 3001
npm start -- --port 3001

# Rodar só os testes cujo caminho contém um termo
npm run test:run -- satellites
npm test -- cloudinary            # em modo watch

# Fuzz mais profundo (como no run noturno do CI)
FUZZ_RUNS=3000 npm run test:fuzz              # bash
$env:FUZZ_RUNS = "3000"; npm run test:fuzz    # PowerShell
```

### 4.3 Scripts de mídia

- **`compress:videos`** precisa do FFmpeg e dos vídeos **originais** em `public/assets/<nome>.mp4`. Os originais não estão no repositório: sem eles, o script imprime `⚠ File not found` para cada vídeo. Arquivos já presentes em `compressed/` são pulados.
- **`upload:cloudinary`** lê as credenciais **somente** de `.env.local`. Para cada vídeo, usa a versão de `compressed/` se ela existir. Os arquivos são enviados com `overwrite: true`, ou seja, **substituem** os assets de mesmo nome na conta Cloudinary. Rode apenas com autorização sobre a conta.
- Um vídeo novo só aparece no site depois de: comprimir, enviar, adicionar a entrada em `videoMap` (`src/lib/cloudinary.ts`), usá-lo numa página e fazer um novo build. Detalhes em [`docs/ARQUITETURA.md`](ARQUITETURA.md#8-pipeline-de-mídia).

---

## 5. Rotina de desenvolvimento

1. Crie a branch a partir de `main` (`feat/...`, `fix/...`, `chore/...`) e use Conventional Commits. Ver [`CONTRIBUTING.md`](../CONTRIBUTING.md#fluxo).
2. Durante o trabalho: `npm run dev` e, em outro terminal, `npm test` (watch).
3. Antes de abrir o PR, rode a mesma sequência do CI:

   ```bash
   npm run lint && npm run typecheck && npm run test:ci && npm run build
   ```

   **Windows PowerShell 5.1** não aceita `&&`. Rode os comandos um por vez, ou use:

   ```powershell
   npm run lint; if ($?) { npm run typecheck }; if ($?) { npm run test:ci }; if ($?) { npm run build }
   ```

4. Abra o PR para `dev`. O GitHub sugere `main`, que é a branch padrão do repositório: troque a base. O CI precisa estar verde antes do merge. É regra do time: o GitHub não bloqueia o merge, porque as branches não têm proteção. A `dev` acumula as mudanças até a publicação, quando é mesclada em `main` ([6.1](#61-caminho-do-código-até-produção)). Hoje `dev` está atrás de `main`, e o PR leva commits a mais: ver a situação em [`CONTRIBUTING.md`](../CONTRIBUTING.md#fluxo).
5. Mudanças em textos: edite os **três** arquivos de `messages/` (`en`, `pt`, `es`) com as mesmas chaves. O teste `src/__tests__/messages-parity.test.ts` reprova o CI se uma chave existir em um arquivo e não nos outros.

O que o CI **não** verifica: a interface no navegador. Não há testes de componente nem end-to-end. Mudanças visuais ou de navegação precisam ser conferidas manualmente com `npm run dev`.

---

## 6. Deploy e CI/CD

Baseado em [`vercel.json`](../vercel.json), [`.github/workflows/`](../.github/workflows) e [`docs/CI-CD.md`](CI-CD.md), que tem os detalhes de cada workflow.

### 6.1 Caminho do código até produção

```text
branch de trabalho (criada a partir de main)
   │  PR para dev ──► ci.yml (lint · typecheck · testes+cobertura · build)
   │                  fuzz.yml · codeql.yml · security.yml
   ▼
dev (acumula as mudanças até a publicação)
   │  PR/merge dev → main
   ▼
main (push)
   ├─► Vercel Git Integration: vercel.json habilita o deploy automático de main
   │     install: npm install · build: npm run build · região gru1 · Git LFS ativo
   │
   └─► deploy.yml
         1. espera o check "Lint · typecheck · test · build" ficar verde no mesmo commit
         2. se o secret VERCEL_TOKEN existir: vercel pull → vercel build --prod → vercel deploy --prebuilt --prod
            se não existir: a etapa de deploy é pulada
         3. smoke test: requisição HTTP a SITE_URL (padrão no workflow: https://ideiaspace.com.br),
            até 10 tentativas; se não receber 200, registra um aviso (não reprova o job)
```

Qual dos dois mecanismos efetivamente publica o site depende da configuração do projeto no painel da Vercel e dos secrets do repositório. Essas informações não estão no código.

### 6.2 Variáveis no ambiente da Vercel

| Variável | Quando é lida | Efeito de alterar |
|---|---|---|
| `RESEND_API_KEY`, `N2YO_API_KEY`, `SPACETRACK_USERNAME`, `SPACETRACK_PASSWORD` | A cada requisição às APIs (runtime) | Não exige mudança de código, mas precisa estar no ambiente do deploy em execução (na Vercel, variáveis alteradas se aplicam a novos deploys) |
| `NEXT_PUBLIC_USE_CLOUDINARY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Durante o build** | Só vale após um **novo build**; precisam estar disponíveis na etapa de build |

### 6.3 Pontos de atenção

- **A Vercel instala com `npm install`** (`installCommand` do `vercel.json`), enquanto o CI usa `npm ci`.
- **O CI faz o build sem nenhuma variável.** Um CI verde garante que o código compila, mas o artefato do CI usa caminhos locais de mídia (sem vídeos).
- **O `deploy.yml` faz checkout sem LFS** (`actions/checkout@v4` sem `lfs: true`). Com o código atual, isso não afeta o site, porque nenhum dos dois modos de mídia serve os arquivos de `public/assets/compressed/`.
- O repositório não define procedimento de rollback nem ambientes de preview. Ambos dependem dos recursos e da configuração da Vercel.

---

## 7. Troubleshooting

### 7.1 Os vídeos não carregam no site local

**Sintoma:** o topo da Home fica preto; os vídeos de fundo não aparecem; o console do navegador mostra `404` para URLs como `/assets/ideiaforword.mp4`.

**Causa (a "armadilha" de quem começa):** sem `NEXT_PUBLIC_USE_CLOUDINARY=true`, o código monta as URLs de vídeo como `/assets/<nome>.mp4`, mas os arquivos estão em `public/assets/compressed/<nome>.mp4`. Isso acontece mesmo com o Git LFS funcionando e os vídeos no disco. **Não é um erro do seu setup.**

**Como lidar:**

1. Para ver o site como ele deve ser, ative o modo Cloudinary no `.env.local`:

   ```env
   NEXT_PUBLIC_USE_CLOUDINARY=true
   ```

2. **Reinicie** o `npm run dev` (ou refaça `npm run build` antes de `npm start`).
3. Confira: as URLs de vídeo passam a ser `https://res.cloudinary.com/<conta>/video/upload/...`. Não é preciso credencial nem `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, porque o código tem um nome de conta padrão. É preciso acesso à internet.

**Se o problema persistir com a variável definida:**

| Verificação | Como |
|---|---|
| O valor é exatamente `true` (minúsculo, sem aspas extras)? | O código compara com a string `'true'` |
| O servidor foi reiniciado depois da mudança? | Pare (`Ctrl+C`) e rode `npm run dev` de novo |
| O arquivo é `.env.local` na **raiz** do projeto? | O Next não lê `.env.example` |
| O vídeo está no `videoMap`? | Só arquivos mapeados em `src/lib/cloudinary.ts` vão para a CDN |

Sem o modo Cloudinary, o restante do site (textos, imagens, navegação, APIs) pode ser desenvolvido e testado normalmente. Só os vídeos ficam ausentes.

### 7.2 Os arquivos `.mp4` têm ~130 bytes (Git LFS)

**Sintoma:** os arquivos em `public/assets/compressed/` têm cerca de 130 bytes e, abertos num editor, mostram:

```text
version https://git-lfs.github.com/spec/v1
oid sha256:d0d7264b1fc910b253274102cf270e2bc72d9b6d6235a362f5600bb55dab5236
size 3798330
```

**Causa:** o repositório foi clonado sem o Git LFS instalado/ativado (ou com `GIT_LFS_SKIP_SMUDGE=1`). O Git trouxe apenas os **ponteiros** que apontam para os vídeos armazenados no LFS.

**Diagnóstico:**

```bash
git lfs version     # o LFS está instalado?
git lfs ls-files    # "-" depois do id = ponteiro; "*" = arquivo real
```

**Solução:**

```bash
git lfs install     # se o LFS acabou de ser instalado
git lfs pull        # baixa os arquivos reais e substitui os ponteiros
```

**O que é afetado pelos ponteiros:**

| Situação | Impacto |
|---|---|
| Visualização do site (`npm run dev`/`build`) | Nenhum com o código atual: o modo local já não encontra os vídeos ([7.1](#71-os-vídeos-não-carregam-no-site-local)) e o modo Cloudinary usa a CDN |
| `npm run upload:cloudinary` | O script prefere os arquivos de `compressed/`, então **tenta enviar o ponteiro de texto no lugar do vídeo** |
| `npm run compress:videos` | Se os originais estiverem presentes, trata os ponteiros em `compressed/` como "já comprimidos" e pula esses vídeos |
| Commits | Sem o LFS ativo, um `.mp4` novo ou alterado pode ser commitado **direto no Git**, fora do LFS, aumentando o repositório permanentemente |

Por isso a regra é: **sempre clone e trabalhe com o Git LFS ativo**, mesmo que o site pareça funcionar sem ele.

### 7.3 Testar o formulário de contato sem a chave do Resend

Sem `RESEND_API_KEY`, a API `/api/contact` **não envia e-mail**: ela valida os dados e devolve um link `mailto:`.

**Pelo navegador:** preencha o formulário em `http://localhost:3000/pt#contact`. O formulário mostra "Mensagem recebida! Abrindo cliente de email..." e o navegador tenta abrir o cliente de e-mail padrão com assunto e corpo preenchidos. O que acontece a seguir depende do sistema operacional e do cliente de e-mail configurado. A mensagem no formulário já confirma que a API respondeu corretamente.

**Pela linha de comando:**

```bash
# Caso válido → 200 com useMailto e mailtoLink
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","subject":"Assunto","message":"Mensagem de teste"}'

# Caso inválido → 400 {"error":"Email inválido"}
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"nao-e-email","subject":"Assunto","message":"x"}'
```

No PowerShell, use `curl.exe` (o `curl` do PowerShell 5.1 é um alias de `Invoke-WebRequest`, com outra sintaxe). Coloque o JSON num arquivo e passe com `-d "@corpo.json"` para evitar problemas de aspas.

**O que esse teste cobre:** validação (campos, tipos, tamanhos, formato de e-mail) e o fallback `mailto:`. O terminal do `npm run dev` registra `RESEND_API_KEY not configured. Using mailto fallback.`

**O que ele não cobre:** o envio real pelo Resend. Esse caminho é coberto pelos testes automatizados, com o SDK do Resend simulado e com o SDK real sobre `fetch` simulado (`npm run test:run -- contact`). Para testá-lo de verdade, use uma chave **de uma conta de teste sua**, nunca a de produção. O remetente (`onboarding@resend.dev`) e o destinatário (`admin@ideiaspace.com`) estão fixos no código. Dependendo da configuração da sua conta, o Resend pode recusar o envio para esse destinatário. Nesse caso, a API responde `500` com o `mailtoLink` e o terminal registra `Error sending email: …`.

### 7.4 Testar a API de satélites sem as chaves da N2YO e do Space-Track

Sem credenciais, `/api/satellites` **não faz chamadas externas**: devolve TLEs estáticos de exemplo, sempre com status `200`.

```bash
curl -i "http://localhost:3000/api/satellites?groups=stations"
curl -i "http://localhost:3000/api/satellites?groups=ideiaspace"
curl -i "http://localhost:3000/api/satellites?groups=starlink"
curl -i "http://localhost:3000/api/satellites?groups=weather"
```

Leia os cabeçalhos da resposta:

| Grupo | `X-Cache-Status` | `X-Data-Source` | Satélites no fallback |
|---|---|---|---|
| `ideiaspace` | `FALLBACK` | `fallback-no-credentials` | 3 |
| `stations`, ausente ou desconhecido | `FALLBACK` | `fallback-no-key` | 3 |
| `starlink` | `FALLBACK` | `fallback-no-key` | 10 |
| `weather` | `FALLBACK` | `fallback-no-key` | 10 |

O terminal do `npm run dev` registra `❌ N2YO_API_KEY não configurada` ou `❌ Space-Track credentials não configuradas`. **Isso é esperado sem credenciais**, não é um erro.

**Para testar com dados reais**, use contas próprias e gratuitas (instruções em [`API_DOCUMENTATION.md`](../API_DOCUMENTATION.md#obtenção-de-credenciais)):

- `N2YO_API_KEY` → grupos `stations`, `starlink`, `weather`. A primeira chamada faz uma requisição por satélite (até 30, com 100 ms de intervalo), então pode levar alguns segundos.
- `SPACETRACK_USERNAME` + `SPACETRACK_PASSWORD` → grupo `ideiaspace`.

Comportamento do cache durante os testes:

- O cache dura 8 horas e fica **na memória do processo**. Para forçar uma nova busca, reinicie o `npm run dev`.
- Em respostas `HIT`, o `X-Data-Source` é sempre `n2yo`, mesmo para o grupo `ideiaspace`. É o comportamento atual do código.

Os caminhos com credenciais (MISS, HIT, STALE, TLE inválido) são cobertos pelos testes com `fetch` simulado: `npm run test:run -- satellites`.

### 7.5 Outros problemas comuns

| Sintoma | Causa | O que fazer |
|---|---|---|
| Erro de versão do Node ao instalar ou rodar | Node abaixo de `20.9.0` | Instale/ative o Node 20 (`nvm use`) |
| Mudei o `.env.local` e nada mudou | O servidor não foi reiniciado, ou o build é anterior à mudança | Reinicie o `npm run dev`; para `npm start`, rode `npm run build` antes |
| `npm start` falha | Não existe build em `.next/` | Rode `npm run build` |
| Porta 3000 ocupada | Outro processo usa a porta | `npm run dev -- --port 3001` |
| A raiz sempre abre no mesmo idioma, mesmo trocando o idioma do navegador | O cookie `NEXT_LOCALE` (gravado ao visitar qualquer página com idioma) tem prioridade | Apague o cookie `NEXT_LOCALE` de `localhost` ou acesse `/en`, `/pt`, `/es` diretamente |
| `/fr`, `/about` (sem prefixo) ou outro caminho estranho mostra a Home em inglês com status 200 | Comportamento atual: o primeiro segmento da URL é tratado como idioma | Use sempre URLs com `/en`, `/pt` ou `/es`. Detalhes em [`docs/ARQUITETURA.md`](ARQUITETURA.md#o-locale-é-tratado-em-mais-de-um-ponto) |
| Links do rodapé "Terms" e "Privacy" dão 404 | As páginas não existem | Comportamento atual; não indica problema no setup |
| O seletor de idioma mostra "BR", "US", "ES" em vez de bandeiras | O Windows não desenha emojis de bandeira | Visual depende do sistema operacional; em macOS/Android aparecem as bandeiras |
| `npm run lint` mostra dezenas de warnings | Dívida técnica existente (`<img>`, imports não usados, `any`) | Warnings não reprovam o CI; só erros |
| Aviso `[baseline-browser-mapping] The data in this module is over two months old` no build | Dependência de desenvolvimento com dados desatualizados | Apenas informativo; o build conclui normalmente |
| `npm run upload:large` falha com "Cannot find module" | `scripts/upload-large-videos.js` não existe | Use `npm run upload:cloudinary` |
| Testes lentos na primeira execução (principalmente no Windows) | Inicialização do ambiente `jsdom` | Execuções seguintes são mais rápidas |
| O teste `messages-parity` falha listando chaves | Uma chave existe em um dos `messages/*.json` e falta em outro | Deixe as mesmas chaves nos três arquivos |

---

## 8. Referências

| Documento | Use quando… |
|---|---|
| [`README.md`](../README.md) | Precisa da visão geral e do setup rápido |
| [`docs/ARQUITETURA.md`](ARQUITETURA.md) | Quer entender como as partes se relacionam e por que os problemas acima existem |
| [`API_DOCUMENTATION.md`](../API_DOCUMENTATION.md) | Precisa do contrato completo das APIs |
| [`docs/CI-CD.md`](CI-CD.md) | Precisa dos detalhes dos workflows e secrets |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Vai abrir uma branch ou um PR |
| [`.env.example`](../.env.example) | Vai configurar variáveis de ambiente |
| [`SECURITY.md`](../SECURITY.md) | Encontrou uma falha de segurança |
