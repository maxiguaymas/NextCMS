'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        active: true,
      }
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Error al obtener usuarios" };
  }
}

export async function updateUserStatus(id: string, active: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return { success: false, error: "No autorizado" };
  }

  try {
    await prisma.user.update({ 
      where: { id },
      data: { active }
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: `Error al ${active ? 'activar' : 'desactivar'} usuario` };
  }
}

export async function updateUserRole(id: string, role: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return { success: false, error: "No autorizado" };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { role: role as any }
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar rol" };
  }
}