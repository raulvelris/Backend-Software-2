import nodemailer from "nodemailer";

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

function buildTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  console.log("Email config:", { host, port, user: user ? "***" : "NOT_SET", pass: pass ? "***" : "NOT_SET" });

  if (!user || !pass) {
    console.error("❌ SMTP_USER/SMTP_PASS no configurados en .env");
    throw new Error("SMTP_USER/SMTP_PASS no configurados. Configura tu .env con credenciales de email.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const transporter = buildTransport();
  
  console.log(`📧 Enviando email a: ${to}`);
  console.log(`📧 Desde: ${from}`);
  console.log(`📧 Asunto: ${subject}`);
  
  try {
    const result = await transporter.sendMail({ from, to, subject, html });
    console.log("✅ Email enviado exitosamente:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
}

export async function sendActivationEmail(to: string, token: string) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const activateUrl = `${baseUrl}/auth/activate?token=${encodeURIComponent(token)}`;
  const html = `
    <p>Activa tu cuenta haciendo clic en el siguiente enlace:</p>
    <p><a href="${activateUrl}">Activar cuenta</a></p>
    <p>Si no funciona, copia y pega esta URL en tu navegador: ${activateUrl}</p>
  `;
  await sendMail({ to, subject: "Activa tu cuenta", html });
}


