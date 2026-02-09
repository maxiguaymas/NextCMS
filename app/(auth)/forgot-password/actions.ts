'use server';

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { randomUUID } from "crypto";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "El correo es obligatorio." };

  try {
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
    return { error: "Ocurrió un error. Inténtalo más tarde." };
  }
}