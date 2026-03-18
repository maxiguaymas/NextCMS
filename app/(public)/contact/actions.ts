'use server';

import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

// Schema de validación para el formulario de contacto
const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  email: z.string().email("Email inválido").max(254, "El email es demasiado largo"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres").max(200, "El asunto es demasiado largo"),
  message: z.string().min(20, "El mensaje debe tener al menos 20 caracteres").max(5000, "El mensaje es demasiado largo"),
  honeypot: z.string().optional(),
});

export async function sendContactForm(formData: FormData) {
  // 1. Extraer y validar datos
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
    honeypot: formData.get('honeypot') as string,
  };

  // 2. Validación básica de seguridad (Honeypot contra bots)
  if (rawData.honeypot) {
    return { success: true }; // Engañamos al bot
  }

  // 3. Validación con Zod
  const result = contactSchema.safeParse(rawData);
  if (!result.success) {
    return { 
      success: false, 
      error: result.error.errors[0]?.message || "Datos inválidos" 
    };
  }

  const { name, email, subject, message } = result.data;

  try {
    // 4. Aplicar rate limiting basado en IP (simulado)
    const ip = '127.0.0.1'; // En producción, obtener de headers
    await checkRateLimit(ip, 'contact');

    // 5. Guardar en la base de datos
    await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    
    // 6. Enviar notificación al admin por email
    sendContactNotification(name, email, subject, message).catch(console.error);

    console.log(`Mensaje guardado en DB de: ${name} (${email})`);

    // 7. Simulamos un pequeño retraso para la experiencia de usuario
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "No se pudo enviar el mensaje. Inténtalo más tarde." };
  }
}