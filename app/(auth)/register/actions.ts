'use server';

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIP } from "@/lib/ip";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schema de validación para registro
const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  email: z.string().email("Email inválido").max(254, "El email es demasiado largo"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
});

export async function registerUser(formData: FormData) {
  // Validar inputs
  const result = registerSchema.safeParse({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Datos inválidos" };
  }

  const { name, email, password } = result.data;

  try {
    // Rate limiting con IP real del cliente
    const ip = await getClientIP();
    await checkRateLimit(ip, 'email');

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
    
    if (error instanceof Error && error.message.includes('Demasiadas solicitudes')) {
      return { error: error.message };
    }
    
    return { error: "Ocurrió un error al crear la cuenta. Inténtalo de nuevo." };
  }
}