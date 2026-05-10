
import {prisma as db } from "@/lib/prisma" 
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache"

export async function submitVerification(data: {
  legalName: string,
  documents: { type: "GOVT_ID" | "BUSINESS_CARD", url: string }[]
}) {
  const { userId } =await auth()
if (!userId) {
    throw new Error("You must be logged in to submit a request.");
  }

  try {
    await db.$transaction(async (tx) => {
      // 1. Create the main request
      const request = await tx.verificationRequest.create({
        data: {
          userId,
          legalName: data.legalName,
          status: "SUBMITTED",
        }
      })

      // 2. Attach the documents
      await tx.verificationDocument.createMany({
        data: data.documents.map(doc => ({
          type: doc.type,
          url: doc.url,
          requestId: request.id
        }))
      })
    })

    revalidatePath("/seller/onboarding")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to submit request" }
  }
}