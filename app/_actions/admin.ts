"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyUser(userId: string, status: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: status },
    });
    revalidatePath("/admin-onboarding"); // Refresh the dashboard data
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}