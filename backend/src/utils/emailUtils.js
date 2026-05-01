const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: (process.env.EMAIL_PASS || '').replace(/\s/g, '')
    }
  });
}

async function sendVerificationEmail(email, code) {
  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"TU diabetes NUESTRA historia" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
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
  console.log(`[Email] Enviado a ${email} - MessageId: ${info.messageId}`);
}

module.exports = { sendVerificationEmail };
