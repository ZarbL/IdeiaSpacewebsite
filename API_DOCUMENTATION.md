# 📡 Documentação das APIs - IdeiaSpace Website

## Índice
- [API de Contato](#api-de-contato)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

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

### Obrigatórias para Contato

```env
# Para envio de emails
RESEND_API_KEY=re_sua_chave_resend
```

### Obtenção de Credenciais

#### Resend
1. Acesse: https://resend.com/
2. Crie conta
3. Verifique domínio (ou use sandbox)
4. Gere API Key

---

## Rate Limits e Considerações

### Resend
- **Plano Gratuito:** 100 emails/dia
- **Plano Pago:** A partir de 3.000 emails/mês
- **Sem rate limit especificado**

---

## Logs e Debugging

### Contato API

```
RESEND_API_KEY not configured. Using mailto fallback.
Contact form submission: { name, email, subject, message }
Email sent successfully: { id: '...' }
Error sending email: [erro]
```

---

## Exemplos de Uso no Frontend

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
└── contact/
    └── route.ts          # API de contato com Resend
```

---

## Melhorias Futuras Sugeridas

### Contato
- [ ] Captcha/reCAPTCHA
- [ ] Rate limiting por IP
- [ ] Sanitização avançada de HTML
- [ ] Templates customizáveis
- [ ] Notificações para múltiplos destinatários
- [ ] Auto-resposta ao usuário

---

## Troubleshooting

### Problema: Email não enviado
**Soluções:**
1. Verificar `RESEND_API_KEY` configurada
2. Verificar domínio verificado no Resend
3. Checar logs para erros específicos
4. Usar modo fallback (mailto)

---

## Contato e Suporte

Para dúvidas ou problemas com as APIs:
- **Email:** admin@ideiaspace.com
- **Website:** https://ideiaspace.com

---

**Última atualização:** 29 de janeiro de 2026
**Versão:** 1.0.0
