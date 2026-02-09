'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getPosts(query?: string, status?: string) {
  try {
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "No se pudieron cargar las publicaciones" };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) return { success: false, error: "Publicación no encontrada" };

    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, error: "Error al cargar la publicación" };
  }
}

export async function updatePost(id: string, data: {
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: data.featuredImage || null,
        excerpt: data.excerpt || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      }
    });

    revalidatePath("/dashboard/content");
    revalidatePath(`/dashboard/content/${id}`);
    
    return { success: true, id: post.id };
  } catch (error: any) {
    console.error("Error Prisma:", error);
    return { success: false, error: "Error al actualizar en la base de datos" };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/dashboard/content");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar la publicación" };
  }
}