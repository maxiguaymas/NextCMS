'use server';

import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mail";

export async function sendContactForm(formData: FormData) {
  // 1. Extraer los datos del formulario
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const honeypot = formData.get('honeypot') as string;

  // 2. Validación básica de seguridad (Honeypot contra bots)
  if (honeypot) {
    return { success: true }; // Engañamos al bot
  }

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Todos los campos son obligatorios." };
  }

  try {
    // 3. Guardar en la base de datos
    await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    
    // Enviar notificación al admin por email
    sendContactNotification(name, email, subject, message).catch(console.error);

    console.log(`Mensaje guardado en DB de: ${name} (${email})`);

    // Simulamos un pequeño retraso para la experiencia de usuario
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, error: "No se pudo enviar el mensaje. Inténtalo más tarde." };
  }
}