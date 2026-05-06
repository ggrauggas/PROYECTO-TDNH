async function sendVerificationEmail(email, code) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'TU diabetes NUESTRA historia', email: 'tudiabetesnuestrahistoria@gmail.com' },
      to: [{ email }],
      subject: 'Tu código de verificación',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e9ecef;">
          <div style="background: linear-gradient(135deg, #1a5f7a 0%, #2c7da0 60%, #2a9d8f 100%); padding: 28px 32px; text-align: center;">
            <img src="https://tudiabetes.netlify.app/og-image.png" alt="TU diabetes NUESTRA historia" style="max-width: 140px; height: auto; border-radius: 8px;" />
          </div>
          <div style="padding: 32px;">
            <p style="margin: 0 0 16px; color: #1a1a2e; font-size: 16px;">Gracias por registrarte. Usa este código para verificar tu cuenta:</p>
            <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px; text-align: center;
                        padding: 24px; background: #f0f4ff; border-radius: 8px; color: #2c7da0;">
              ${code}
            </div>
            <p style="margin-top: 16px; color: #6c757d; font-size: 14px;">
              Este código caduca en 15 minutos. Si no solicitaste este registro, ignora este mensaje.
            </p>
          </div>
        </div>
      `
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Brevo error ${response.status}`);
  }

  const data = await response.json();
  console.log(`[Email] Enviado a ${email} - messageId: ${data.messageId}`);
}

module.exports = { sendVerificationEmail };
