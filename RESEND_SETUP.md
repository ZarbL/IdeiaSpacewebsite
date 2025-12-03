# Configuração do Envio de Emails com Resend

Este guia explica como configurar o envio de emails real no formulário de contato.

## Passo 1: Criar conta no Resend

1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Confirme seu email

## Passo 2: Obter API Key

1. Faça login no [dashboard do Resend](https://resend.com/api-keys)
2. Clique em "API Keys" no menu lateral
3. Clique em "Create API Key"
4. Dê um nome (ex: "IdeiaSpace Website")
5. Copie a chave gerada (começa com `re_`)

## Passo 3: Configurar no Projeto

1. Crie o arquivo `.env.local` na raiz do projeto (se ainda não existe)
2. Adicione a seguinte linha:

```env
RESEND_API_KEY=re_sua_chave_aqui
```

## Passo 4: (Opcional) Configurar Domínio Próprio

Por padrão, os emails são enviados de `onboarding@resend.dev`. Para usar seu próprio domínio:

1. No dashboard do Resend, vá em "Domains"
2. Clique em "Add Domain"
3. Digite `ideiaspace.com` (ou seu domínio)
4. Adicione os registros DNS fornecidos no seu provedor de domínio
5. Aguarde a verificação (pode levar até 48h)
6. Atualize o arquivo `/src/app/api/contact/route.ts`:

```typescript
from: 'Contato <contato@ideiaspace.com>', // Substitua pelo seu domínio
```

## Passo 5: Testar

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse a página de contato
3. Preencha e envie o formulário
4. Verifique o email em `contato@ideiaspace.com`

## Troubleshooting

### Email não está sendo enviado
- Verifique se a `RESEND_API_KEY` está configurada corretamente em `.env.local`
- Reinicie o servidor após adicionar a variável de ambiente
- Verifique os logs do console para erros

### Email vai para spam
- Configure SPF, DKIM e DMARC no seu domínio
- Use um domínio próprio verificado ao invés de `onboarding@resend.dev`

### Limite de emails
- Plano gratuito: 100 emails/dia, 3,000 emails/mês
- Para mais, considere um plano pago

## Alternativas

Se preferir não usar Resend, você pode:
- Usar SendGrid (similar ao Resend)
- Usar Amazon SES
- Manter o fallback para `mailto:` (abre o cliente de email do usuário)

## Custos

- **Plano Gratuito**: 100 emails/dia, 3,000 emails/mês
- **Plano Pago**: A partir de $20/mês para 50,000 emails/mês

## Suporte

- Documentação oficial: https://resend.com/docs
- Discord do Resend: https://resend.com/discord
