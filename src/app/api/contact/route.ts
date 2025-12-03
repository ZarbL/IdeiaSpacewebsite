import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validação básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Se não houver RESEND_API_KEY configurada, usa mailto como fallback
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured. Using mailto fallback.');
      console.log('Contact form submission:', { name, email, subject, message });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Mensagem recebida! Abrindo cliente de email...',
          useMailto: true,
          mailtoLink: `mailto:contato@ideiaspace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
          )}`
        },
        { status: 200 }
      );
    }

    // Envia email real usando Resend
    const data = await resend.emails.send({
      from: 'IdeiaSpace Website <onboarding@resend.dev>',
      to: 'contato@ideiaspace.com',
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
                  <span>${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Assunto:</span>
                  <span>${subject}</span>
                </div>
                <div class="message-box">
                  <h3 style="margin-top: 0; color: #667eea;">Mensagem:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
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

    console.log('Email sent successfully:', data);

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
        mailtoLink: `mailto:contato@ideiaspace.com`
      },
      { status: 500 }
    );
  }
}
