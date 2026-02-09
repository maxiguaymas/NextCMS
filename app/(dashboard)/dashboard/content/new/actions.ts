'use server';

import { prisma } from "@/lib/prisma"; // Asegúrate de tener exportado prisma en lib/prisma.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: data.featuredImage || null,
        excerpt: data.excerpt || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        author: { connect: { email: session.user.email! } }
      }
    });

    // Limpiar la caché de la lista de posts para que aparezca el nuevo
    revalidatePath("/dashboard/content");
    
    return { success: true, id: post.id };
  } catch (error: any) {
    console.error("Error Prisma:", error);
    return { success: false, error: "Error al guardar en la base de datos" };
  }
}