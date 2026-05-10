"use server"

import { prisma as db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveDealer(requestId: string, userId: string) {
  await db.$transaction([
    // Update the request
    db.verificationRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" }
    }),
    // Upgrade the user
    db.user.update({
      where: { id: userId },
      data: { 
        role: "DEALER",
        isVerified: true 
      }
    })
  ])

  revalidatePath("/admin/dashboard/verification")
}
export async function rejectDealer(requestId: string, notes: string) {
  await db.verificationRequest.update({
    where: { id: requestId },
    data: { 
      status: "REJECTED",
      adminNotes: notes 
    }
  })

  revalidatePath("/admin/dashboard/verification")
}