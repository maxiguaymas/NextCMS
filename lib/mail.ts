import nodemailer from 'nodemailer';
import { z } from 'zod';

// Validación de variables de entorno
const envSchema = z.object({
  GMAIL_USER: z.string().email("GMAIL_USER debe ser un email válido"),
  GMAIL_APP_PASSWORD: z.string().min(1, "GMAIL_APP_PASSWORD es requerido"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL debe ser una URL válida"),
});

const env = envSchema.parse({
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});

// Configuramos el transportador de Gmail con validación estricta
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Verificar conexión SMTP al iniciar
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error de conexión SMTP:', error);
  } else {
    console.log('✅ Conexión SMTP establecida correctamente');
  }
});

// Función para sanitizar inputs y prevenir inyección de headers
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\r\n]/g, ' ') // Remove newlines
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\x00/g, ''); // Remove null bytes
}

// Función para validar email
function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 254;
}

/**
 * Envía un correo de bienvenida profesional cuando un usuario se registra.
 */
export async function sendWelcomeEmail(to: string, name: string) {
  // Validar inputs
  if (!isValidEmail(to)) {
    throw new Error('Email inválido');
  }
  
  const sanitizedName = sanitizeInput(name);
  const sanitizedTo = sanitizeInput(to);

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
      <div style="background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #068ce5; padding: 40px 30px; text-align: center;">
          <div style="display: inline-block; background: white; color: #068ce5; width: 40px; height: 40px; line-height: 40px; border-radius: 10px; font-weight: bold; font-size: 20px; margin-bottom: 15px;">N</div>
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.025em; font-weight: 800;">¡Bienvenido a NextCMS!</h1>
        </div>
        <div style="padding: 40px; color: #0f172a; line-height: 1.8;">
          <p style="font-size: 20px; font-weight: 700; margin-top: 0; color: #0f172a;">Hola ${sanitizedName},</p>
          <p style="color: #475569; font-size: 16px;">Estamos emocionados de tenerte en la comunidad. NextCMS ha sido diseñado para ofrecerte la máxima velocidad y flexibilidad en la gestión de tus contenidos técnicos.</p>
          <p style="color: #475569; font-size: 16px;">Tu cuenta ha sido creada con éxito. Ahora puedes acceder a tu panel de control personalizado.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${env.NEXTAUTH_URL}/login" style="background-color: #068ce5; color: white !important; padding: 16px 36px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(6, 140, 229, 0.3);">Acceder a mi Panel</a>
          </div>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0; text-align: center;">¿Tienes preguntas? Responde a este correo y nuestro equipo técnico te ayudará.</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          © ${new Date().getFullYear()} NextCMS Team • Built for Developers
        </div>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"NextCMS Team" <${env.GMAIL_USER}>`,
    to: sanitizedTo,
    subject: '🚀 ¡Bienvenido a la comunidad de NextCMS!',
    html: htmlContent,
  });
}

/**
 * Envía un correo para verificar la cuenta.
 */
export async function sendVerificationEmail(to: string, token: string) {
  if (!isValidEmail(to)) {
    throw new Error('Email inválido');
  }
  
  const sanitizedTo = sanitizeInput(to);
  const sanitizedToken = sanitizeInput(token);

  const confirmLink = `${env.NEXTAUTH_URL}/api/verify?token=${sanitizedToken}`;

  return transporter.sendMail({
    from: `"NextCMS Security" <${env.GMAIL_USER}>`,
    to: sanitizedTo,
    subject: '🔐 Verifica tu cuenta de NextCMS',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #0f172a;">Verifica tu dirección de correo</h2>
        <p style="color: #475569;">Gracias por registrarte. Para completar tu perfil y asegurar tu cuenta, por favor haz clic en el botón de abajo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #068ce5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verificar mi cuenta</a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p style="font-size: 12px; color: #068ce5;">${confirmLink}</p>
      </div>
    `,
  });
}

/**
 * Envía un correo para restablecer la contraseña.
 */
export async function sendPasswordResetEmail(to: string, token: string) {
  if (!isValidEmail(to)) {
    throw new Error('Email inválido');
  }
  
  const sanitizedTo = sanitizeInput(to);
  const sanitizedToken = sanitizeInput(token);

  const resetLink = `${env.NEXTAUTH_URL}/reset-password?token=${sanitizedToken}`;

  return transporter.sendMail({
    from: `"NextCMS Security" <${env.GMAIL_USER}>`,
    to: sanitizedTo,
    subject: '🔑 Restablece tu contraseña de NextCMS',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
        <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #0f172a; margin-top: 0;">Restablecer contraseña</h2>
          <p style="color: #475569; line-height: 1.6;">Has solicitado restablecer la contraseña de tu cuenta en NextCMS. Haz clic en el botón de abajo para continuar. Este enlace expirará en 1 hora.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #068ce5; color: white !important; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Cambiar mi contraseña</a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
        </div>
      </div>
    `,
  });
}

/**
 * Envía una confirmación de suscripción al boletín.
 */
export async function sendNewsletterConfirmation(to: string) {
  if (!isValidEmail(to)) {
    throw new Error('Email inválido');
  }
  
  const sanitizedTo = sanitizeInput(to);

  return transporter.sendMail({
    from: `"NextCMS" <${env.GMAIL_USER}>`,
    to: sanitizedTo,
    subject: '✅ Suscripción confirmada',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="padding: 40px; color: #0f172a; line-height: 1.6;">
            <div style="color: #068ce5; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Newsletter</div>
            <h2 style="margin: 0 0 20px 0; font-size: 24px; letter-spacing: -0.025em;">¡Ya estás en la lista!</h2>
            <p style="color: #475569; font-size: 16px;">Gracias por suscribirte a nuestro boletín técnico. A partir de ahora, recibirás actualizaciones semanales sobre ingeniería, CMS y las últimas novedades de <strong>NextCMS</strong>.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Si no solicitaste esta suscripción, puedes ignorar este correo o cancelar la suscripción en cualquier momento.</p>
            </div>
          </div>
          <div style="background-color: #0f172a; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
            Enviado con ❤️ por el equipo de NextCMS
          </div>
        </div>
      </div>
    `,
  });
}

/**
 * Notifica al administrador sobre un nuevo mensaje de contacto.
 */
export async function sendContactNotification(name: string, email: string, subject: string, message: string) {
  if (!isValidEmail(email)) {
    throw new Error('Email inválido');
  }
  
  const sanitizedName = sanitizeInput(name);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedSubject = sanitizeInput(subject);
  const sanitizedMessage = sanitizeInput(message);

  return transporter.sendMail({
    from: `"NextCMS System" <${env.GMAIL_USER}>`,
    to: env.GMAIL_USER, // Te lo envías a ti mismo
    subject: `📩 Nuevo contacto: ${sanitizedSubject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #068ce5;">Nuevo mensaje recibido</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p><strong>De:</strong> ${sanitizedName} (${sanitizedEmail})</p>
          <p><strong>Asunto:</strong> ${sanitizedSubject}</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; white-space: pre-wrap;">
            ${sanitizedMessage}
          </div>
        </div>
        <div style="margin-top: 20px;">
          <a href="${env.NEXTAUTH_URL}/dashboard/messages" style="color: #068ce5; font-weight: bold; text-decoration: none;">
            Ver en el Dashboard →
          </a>
        </div>
      </div>
    `,
  });
}