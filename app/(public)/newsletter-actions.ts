'use server';

import { prisma } from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIP } from "@/lib/ip";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido").max(254, "El email es demasiado largo");

export async function subscribeToNewsletter(formData: FormData) {
  const rawEmail = formData.get('email') as string;

  // Validar email
  const result = emailSchema.safeParse(rawEmail);
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Email inválido" };
  }

  const email = result.data;

  try {
    // Rate limiting con IP real del cliente
    const ip = await getClientIP();
    await checkRateLimit(ip, 'newsletter');

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    // Enviamos el correo de confirmación (sin esperar a que termine para no bloquear la UI)
    sendNewsletterConfirmation(email)
      .then(() => console.log(`Confirmation email sent to: ${email}`))
      .catch(err => console.error("Error enviando email:", err));

    return { success: true };
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return { error: "Este correo ya está suscrito a nuestro boletín." };
    }
    
    if (error instanceof Error && error.message.includes('Demasiadas solicitudes')) {
      return { error: error.message };
    }
    
    return { error: "Ocurrió un error. Inténtalo de nuevo más tarde." };
  }
}