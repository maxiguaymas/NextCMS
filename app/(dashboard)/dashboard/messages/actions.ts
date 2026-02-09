'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUnreadMessagesCount() {
  try {
    return await prisma.contactMessage.count({
      where: { read: false }
    });
  } catch (error) {
    return 0;
  }
}

export async function markAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { read: true }
    });
    revalidatePath('/dashboard/messages');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}