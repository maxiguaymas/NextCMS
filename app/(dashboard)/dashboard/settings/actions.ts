'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    }
  });
}

export async function updateProfile(data: { name: string; image?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "No autorizado" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        image: data.image || null,
      }
    });

    revalidatePath("/dashboard/settings");
    // También revalidamos el layout para que el avatar de la sidebar se actualice
    revalidatePath("/dashboard"); 
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Error al actualizar el perfil" };
  }
}

export async function updatePassword(data: { current: string; new: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true }
    });

    // Caso para usuarios que entraron con Google/GitHub y no tienen password local
    if (!user?.password) {
      return { success: false, error: "Esta cuenta usa autenticación social. No se puede cambiar la contraseña directamente." };
    }

    const isMatch = await bcrypt.compare(data.current, user.password);
    if (!isMatch) {
      return { success: false, error: "La contraseña actual es incorrecta" };
    }

    const hashedPassword = await bcrypt.hash(data.new, 12);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}