'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(token: string, password: string) {
  if (!token || !password || password.length < 6) {
    return { error: "Datos no válidos." };
  }

  try {
    // 1. Buscar el token y verificar expiración
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { error: "El enlace ha expirado o no es válido." };
    }

    // 2. Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Actualizar usuario y borrar el token (para que no se use dos veces)
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Error al restablecer la contraseña." };
  }
}