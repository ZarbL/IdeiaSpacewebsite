import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Construção preguiçosa: `new Resend()` lança quando a chave está ausente
// (resend v6). Fazer isso no nível do módulo quebra o `next build` em ambientes
// sem RESEND_API_KEY (CI, previews). Só instancia quando vai enviar de verdade.
function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const MAX_FIELD_LENGTHS: Record<string, number> = {
  name: 200,
  email: 320,
  subject: 200,
  message: 5000,
};

/** Escapa para interpolação segura dentro de HTML (corpo do email). */
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const { name, email, subject, message } = body ?? {};

    // Validação básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Tipos e tamanhos
    for (const [field, value] of Object.entries({ name, email, subject, message })) {
      if (typeof value !== 'string' || value.length > MAX_FIELD_LENGTHS[field]) {
        return NextResponse.json(
          { error: `Campo "${field}" inválido` },
          { status: 400 }
        );
      }
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Valores prontos para interpolar no HTML do email
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      subject: escapeHtml(subject),
      message: escapeHtml(message),
    };

    // Se não houver RESEND_API_KEY configurada, usa mailto como fallback
    const resend = getResendClient();
    if (!resend) {
      console.log('RESEND_API_KEY not configured. Using mailto fallback.');

      return NextResponse.json(
        { 
          success: true, 
          message: 'Mensagem recebida! Abrindo cliente de email...',
          useMailto: true,
          mailtoLink: `mailto:admin@ideiaspace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
          )}`
        },
        { status: 200 }
      );
    }

    // Envia email real usando Resend
    const data = await resend.emails.send({
      from: 'IdeiaSpace Website <onboarding@resend.dev>',
      to: 'admin@ideiaspace.com',
      replyTo: email,
      subject: `[Website] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .info-row {
                margin: 15px 0;
                padding: 10px;
                background: white;
                border-left: 4px solid #667eea;
                border-radius: 4px;
              }
              .label {
                font-weight: bold;
                color: #667eea;
                display: inline-block;
                min-width: 80px;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 4px;
                margin-top: 20px;
                border: 1px solid #ddd;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #888;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📧 Nova Mensagem do Website</h2>
              </div>
              <div class="content">
                <div class="info-row">
                  <span class="label">Nome:</span>
                  <span>${safe.name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span><a href="mailto:${encodeURIComponent(email)}">${safe.email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Assunto:</span>
                  <span>${safe.subject}</span>
                </div>
                <div class="message-box">
                  <h3 style="margin-top: 0; color: #667eea;">Mensagem:</h3>
                  <p style="white-space: pre-wrap;">${safe.message}</p>
                </div>
              </div>
              <div class="footer">
                <p>Esta mensagem foi enviada através do formulário de contato em ideiaspace.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', data.data?.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        emailId: data.data?.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Em caso de erro, oferece mailto como fallback
    return NextResponse.json(
      { 
        error: 'Erro ao enviar mensagem. Abrindo cliente de email...',
        useMailto: true,
        mailtoLink: `mailto:admin@ideiaspace.com`
      },
      { status: 500 }
    );
  }
}
