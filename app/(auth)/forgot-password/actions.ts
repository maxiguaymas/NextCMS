'use server';

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { randomUUID } from "crypto";
import { z } from "zod";

const emailSchema = z.string().email("Email inválido");

export async function requestPasswordReset(formData: FormData) {
  const rawEmail = formData.get("email") as string;

  // Validar email
  const result = emailSchema.safeParse(rawEmail);
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Email inválido" };
  }

  const email = result.data;

  try {
    // Rate limiting
    const ip = '127.0.0.1'; // En producción, obtener de headers
    await checkRateLimit(ip, 'email');

    const user = await prisma.user.findUnique({ where: { email } });

    // Si el usuario no existe, no lo decimos por seguridad.
    if (!user) {
      return { success: true }; 
    }

    // Generar token único que expire en 1 hora
    const token = randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000);

    // Eliminar tokens anteriores para este email para asegurar que solo haya uno activo
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    });

    // Crear el nuevo token
    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    await sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error("Reset request error:", error);
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return { error: error.message };
    }
    
    return { error: "Ocurrió un error. Inténtalo más tarde." };
  }
}