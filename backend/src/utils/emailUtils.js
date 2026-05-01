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
