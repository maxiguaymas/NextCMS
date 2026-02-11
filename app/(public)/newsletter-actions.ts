'use server';

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { sendNewsletterConfirmation } from "@/lib/mail";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { error: "Por favor, introduce un email válido." };
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    // Enviamos el correo de confirmación (sin esperar a que termine para no bloquear la UI)
    sendNewsletterConfirmation(email)
      .then(() => console.log(`Confirmation email sent to: ${email}`))
      .catch(err => console.error("Error enviando email:", err));

    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: "Este correo ya está suscrito a nuestro boletín." };
    }
    return { error: "Ocurrió un error. Inténtalo de nuevo más tarde." };
  }
}