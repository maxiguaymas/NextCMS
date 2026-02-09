import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token"); // En nuestro caso, es el ID del usuario

  if (!token) {
    return new Response("Token de verificación no válido", { status: 400 });
  }

  try {
    // 1. Buscar al usuario por el ID (token)
    const user = await prisma.user.findUnique({
      where: { id: token },
    });

    if (!user) {
      return new Response("Usuario no encontrado", { status: 404 });
    }

    // 2. Marcar el correo como verificado
    await prisma.user.update({
      where: { id: token },
      data: {
        emailVerified: new Date(),
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return new Response("Error al verificar la cuenta", { status: 500 });
  }

  // 3. Redirigir al login con un parámetro de éxito (fuera del try-catch)
  redirect("/login?verified=true");
}