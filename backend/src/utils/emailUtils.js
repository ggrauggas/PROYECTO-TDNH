const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, code) {
  const { data, error } = await resend.emails.send({
    from: 'TU diabetes NUESTRA historia <onboarding@resend.dev>',
    to: email,
    subject: 'Tu código de verificación',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0d6efd;">TU diabetes NUESTRA historia</h2>
        <p>Gracias por registrarte. Usa este código para verificar tu cuenta:</p>
        <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px; text-align: center;
                    padding: 24px; background: #f0f4ff; border-radius: 8px; color: #0d6efd;">
          ${code}
        </div>
        <p style="margin-top: 16px; color: #6c757d; font-size: 14px;">
          Este código caduca en 15 minutos. Si no solicitaste este registro, ignora este mensaje.
        </p>
      </div>
    `
  });

  if (error) throw new Error(error.message);
  console.log(`[Email] Enviado a ${email} - ID: ${data.id}`);
}

module.exports = { sendVerificationEmail };
