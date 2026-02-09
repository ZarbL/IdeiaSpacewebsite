# 📡 Documentação das APIs - IdeiaSpace Website

## Índice
- [API de Satélites](#api-de-satélites)
- [API de Contato](#api-de-contato)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## API de Satélites

**Endpoint:** `/api/satellites`  
**Método:** `GET`  
**Formato:** TLE (Three-Line Element)

### Descrição
Retorna dados TLE (Two-Line Element Set) de satélites para visualização e rastreamento orbital. Utiliza duas fontes de dados:
- **Space-Track.org** para satélites IdeiaSpace
- **N2YO API** para outros satélites (Starlink, estações espaciais, satélites meteorológicos)

### Parâmetros Query String

| Parâmetro | Tipo | Obrigatório | Descrição | Valores Possíveis |
|-----------|------|-------------|-----------|-------------------|
| `groups` | string | Não | Categoria de satélites | `ideiaspace`, `stations`, `starlink`, `weather` |

**Padrão:** `stations`

### Exemplos de Requisição

```bash
# Satélites IdeiaSpace (SARI-1, SARI-2, ANISC)
GET /api/satellites?groups=ideiaspace

# Estações espaciais (ISS, Tiangong, Hubble)
GET /api/satellites?groups=stations

# Constelação Starlink
GET /api/satellites?groups=starlink

# Satélites meteorológicos (NOAA, Aqua, Terra, GOES, etc)
GET /api/satellites?groups=weather
```

### Resposta

**Content-Type:** `text/plain`  
**Formato TLE:** 3 linhas por satélite (nome + linha 1 + linha 2)

```
SARI-1
1 66668U 25000A   26021.50000000  .00001000  00000+0  50000-4 0  9990
2 66668  97.5000  45.0000 0005000  90.0000 270.0000 15.10000000  1234
SARI-2
1 66669U 25000B   26021.50000000  .00001000  00000+0  50000-4 0  9991
2 66669  97.5000  50.0000 0005000  95.0000 265.0000 15.10000000  1235
```

### Headers de Resposta

| Header | Valores | Descrição |
|--------|---------|-----------|
| `X-Cache-Status` | `HIT`, `MISS`, `STALE`, `FALLBACK` | Status do cache |
| `X-Data-Source` | `spacetrack`, `n2yo`, `fallback-error`, etc | Fonte dos dados |

### Categorias de Satélites Configuradas

#### `ideiaspace`
- **SARI-1** (66668)
- **SARI-2** (66669)
- **ANISC** (66670)
- **Fonte:** Space-Track.org

#### `stations`
- **ISS - International Space Station** (25544)
- **Tiangong - Chinese Space Station** (48274)
- **Hubble Space Telescope** (20580)
- **Fonte:** N2YO

#### `starlink`
- 30 satélites Starlink Gen1 em diferentes órbitas
- IDs: 44713-44936 (selecionados)
- **Fonte:** N2YO

#### `weather`
- **NOAA:** 18, 19, 20, 21
- **NASA:** Aqua, Terra, Suomi NPP
- **EUMETSAT:** METOP-A, METOP-B, METOP-C
- **Geostationary:** GOES 16, 17, 18
- **ESA:** Sentinel-3A, 3B, 5P
- **Landsat:** 8, 9
- **Fengyun:** 3D, 3E, 4A
- **Fonte:** N2YO

### Cache
- **Duração:** 8 horas (28.800.000 ms)
- **Tipo:** Em memória (RAM)
- **Comportamento:**
  - Cache HIT: Retorna dados armazenados
  - Cache expirado + erro API: Retorna cache STALE
  - Sem cache + erro API: Retorna dados FALLBACK estáticos

### Tratamento de Erros

1. **Credenciais ausentes:** Retorna dados de fallback estáticos
2. **Erro na API:** Tenta usar cache expirado, senão usa fallback
3. **TLE inválido:** Valida formato antes de cachear
4. **Timeout:** 20 segundos (apenas N2YO)

### Integração Space-Track.org

```typescript
// Autenticação
POST https://www.space-track.org/ajaxauth/login
Content-Type: application/x-www-form-urlencoded
Body: identity=USERNAME&password=PASSWORD

// Buscar TLEs
GET https://www.space-track.org/basicspacedata/query/class/gp/NORAD_CAT_ID/{ids}/orderby/TLE_LINE1 ASC/format/3le
Cookie: [cookie da autenticação]
```

### Integração N2YO API

```typescript
// Buscar TLE individual
GET https://api.n2yo.com/rest/v1/satellite/tle/{NORAD_ID}&apiKey={API_KEY}
Accept: application/json

// Resposta
{
  "info": {
    "satname": "ISS (ZARYA)",
    "satid": 25544
  },
  "tle": "1 25544U ...\r\n2 25544 ..."
}
```

### Validação de TLE

A API valida automaticamente se os dados retornados são TLE válidos:
- Verifica formato de múltiplos de 3 linhas
- Confirma que linhas começam com "1 " e "2 "
- Rejeita HTML ou dados corrompidos

---

## API de Contato

**Endpoint:** `/api/contact`  
**Método:** `POST`  
**Formato:** JSON

### Descrição
Envia emails de contato do formulário do website usando o serviço **Resend**. Possui fallback para `mailto:` caso o serviço não esteja configurado.

### Corpo da Requisição

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### Validações

| Campo | Validação |
|-------|-----------|
| `name` | Obrigatório, não vazio |
| `email` | Obrigatório, formato válido (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `subject` | Obrigatório, não vazio |
| `message` | Obrigatório, não vazio |

### Exemplos de Requisição

```bash
curl -X POST https://ideiaspace.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "subject": "Interesse em parceria",
    "message": "Gostaria de saber mais sobre as soluções da IdeiaSpace."
  }'
```

### Respostas

#### ✅ Sucesso (200 OK)

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
  "emailId": "abc123xyz"
}
```

#### ⚠️ Fallback - Mailto (200 OK)

```json
{
  "success": true,
  "message": "Mensagem recebida! Abrindo cliente de email...",
  "useMailto": true,
  "mailtoLink": "mailto:admin@ideiaspace.com?subject=..."
}
```

#### ❌ Validação (400 Bad Request)

```json
{
  "error": "Todos os campos são obrigatórios"
}
```

```json
{
  "error": "Email inválido"
}
```

#### ❌ Erro no envio (500 Internal Server Error)

```json
{
  "error": "Erro ao enviar mensagem. Abrindo cliente de email...",
  "useMailto": true,
  "mailtoLink": "mailto:admin@ideiaspace.com"
}
```

### Template de Email

O email enviado utiliza HTML formatado com:
- **Header:** Gradiente roxo com título
- **Campos:** Nome, Email, Assunto
- **Mensagem:** Box destacado com texto preservando quebras de linha
- **Footer:** Informações sobre origem (website)

**Configuração Resend:**
- **De:** `IdeiaSpace Website <onboarding@resend.dev>`
- **Para:** `admin@ideiaspace.com`
- **Reply-To:** Email do usuário
- **Assunto:** `[Website] {subject}`

### Modos de Operação

1. **Modo Completo:** Com `RESEND_API_KEY` configurada → Envia email real
2. **Modo Fallback:** Sem `RESEND_API_KEY` → Retorna link `mailto:`
3. **Modo Erro:** Falha no envio → Retorna link `mailto:` de backup

---

## Variáveis de Ambiente

### Obrigatórias para Satélites

```env
# Para satélites IdeiaSpace (Space-Track.org)
SPACETRACK_USERNAME=seu_email@example.com
SPACETRACK_PASSWORD=sua_senha_segura

# Para outros satélites (N2YO)
N2YO_API_KEY=sua_chave_api_n2yo
```

### Obrigatórias para Contato

```env
# Para envio de emails
RESEND_API_KEY=re_sua_chave_resend
```

### Obtenção de Credenciais

#### Space-Track.org
1. Acesse: https://www.space-track.org/auth/createAccount
2. Crie conta gratuita
3. Justifique uso (ex: "Educational/Research")
4. Aprovação geralmente instantânea

#### N2YO API
1. Acesse: https://www.n2yo.com/api/
2. Crie conta
3. Gere API Key no dashboard
4. Plano gratuito: 1000 requests/hora

#### Resend
1. Acesse: https://resend.com/
2. Crie conta
3. Verifique domínio (ou use sandbox)
4. Gere API Key

---

## Rate Limits e Considerações

### Space-Track.org
- **Limite:** 30 requests/minuto, 300 requests/hora
- **Cache:** 8 horas (reduz significativamente requests)
- **Autenticação:** Cookie por requisição

### N2YO
- **Limite:** 1000 requests/hora (plano gratuito)
- **Delay:** 100ms entre requisições para não sobrecarregar
- **Timeout:** 20 segundos
- **Cache:** 8 horas por grupo

### Resend
- **Plano Gratuito:** 100 emails/dia
- **Plano Pago:** A partir de 3.000 emails/mês
- **Sem rate limit especificado**

---

## Logs e Debugging

### Satélites API

```
✅ Cache HIT para stations (45 minutos atrás)
🌐 Buscando dados TLE de ideiaspace do Space-Track...
✅ 3 satélites TLE de ideiaspace recebidos do Space-Track e armazenados em cache
📊 IDs solicitados: 3, TLEs recebidos: 3
❌ Erro ao buscar do Space-Track: [erro]
📦 Usando cache expirado de stations (erro na API)
📦 Usando dados de fallback para weather
```

### Contato API

```
RESEND_API_KEY not configured. Using mailto fallback.
Contact form submission: { name, email, subject, message }
Email sent successfully: { id: '...' }
Error sending email: [erro]
```

---

## Exemplos de Uso no Frontend

### Buscar Satélites

```typescript
async function fetchSatellites(group: string) {
  const response = await fetch(`/api/satellites?groups=${group}`);
  const tleData = await response.text();
  
  // Headers úteis
  const cacheStatus = response.headers.get('X-Cache-Status');
  const dataSource = response.headers.get('X-Data-Source');
  
  console.log(`Cache: ${cacheStatus}, Fonte: ${dataSource}`);
  
  return parseTLE(tleData);
}
```

### Enviar Formulário de Contato

```typescript
async function sendContactForm(data: ContactData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (result.useMailto) {
    // Fallback: abrir cliente de email
    window.location.href = result.mailtoLink;
  } else if (result.success) {
    // Sucesso: mostrar mensagem
    alert(result.message);
  }
}
```

---

## Estrutura de Arquivos

```
src/app/api/
├── contact/
│   └── route.ts          # API de contato com Resend
└── satellites/
    └── route.ts          # API de satélites (Space-Track + N2YO)
```

---

## Melhorias Futuras Sugeridas

### Satélites
- [ ] Cache persistente (Redis/Database)
- [ ] WebSocket para atualizações em tempo real
- [ ] Adicionar mais categorias de satélites
- [ ] Endpoint para buscar satélite específico por NORAD ID
- [ ] Métricas de uso da API
- [ ] Rate limiting por IP

### Contato
- [ ] Captcha/reCAPTCHA
- [ ] Rate limiting por IP
- [ ] Sanitização avançada de HTML
- [ ] Templates customizáveis
- [ ] Notificações para múltiplos destinatários
- [ ] Auto-resposta ao usuário

---

## Troubleshooting

### Problema: "Space-Track credentials not configured"
**Solução:** Adicione `SPACETRACK_USERNAME` e `SPACETRACK_PASSWORD` no `.env.local`

### Problema: "N2YO_API_KEY não configurada"
**Solução:** Adicione `N2YO_API_KEY` no `.env.local`

### Problema: Email não enviado
**Soluções:**
1. Verificar `RESEND_API_KEY` configurada
2. Verificar domínio verificado no Resend
3. Checar logs para erros específicos
4. Usar modo fallback (mailto)

### Problema: TLE inválidos retornados
**Causas possíveis:**
1. API retornou HTML (erro)
2. Formato incorreto
3. NORAD IDs inexistentes

**Solução:** API automaticamente usa cache STALE ou FALLBACK

---

## Contato e Suporte

Para dúvidas ou problemas com as APIs:
- **Email:** admin@ideiaspace.com
- **Website:** https://ideiaspace.com

---

**Última atualização:** 29 de janeiro de 2026
**Versão:** 1.0.0
