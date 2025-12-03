import { Resend } from 'resend';

const resend = new Resend('re_UgprSLAU_HyZnCRxuAZxSGkZ6GZhexNaA');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'lfsz12@hotmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    
    console.log('✅ Email enviado com sucesso!');
    console.log('ID do email:', data.id);
    console.log('Dados completos:', data);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testEmail();
