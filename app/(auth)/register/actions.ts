'use server';

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  try {
    // 1. Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Este correo electrónico ya está registrado." };
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'VIEWER', // Rol por defecto
      }
    });

    // 4. Enviar Email de Verificación
    await sendVerificationEmail(user.email, user.id);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Ocurrió un error al crear la cuenta. Inténtalo de nuevo." };
  }
}