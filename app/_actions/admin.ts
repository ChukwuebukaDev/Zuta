"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";
import { DealerStatus } from "@prisma/client";

/**
 * Internal helper to verify Admin Role securely via Supabase and Prisma
 */
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Unauthorized: Session invalid or expired.");
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    throw new Error("Forbidden: Administrative privilege required.");
  }

  return user.id;
}

/**
 * Verifies a Dealer's Onboarding Status and flags their profile ACTIVE
 */
export async function verifyUser(targetUserId: string, status: boolean) {
  try {
    await checkAdmin(); // Security Gate

    // Atomic transaction updating both verification status and profile enum state
    await db.$transaction([
      db.user.update({
        where: { id: targetUserId },
        data: { isVerified: status },
      }),
      db.dealerProfile.updateMany({
        where: { userId: targetUserId },
        data: { status: status ? DealerStatus.APPROVED : DealerStatus.PENDING }
      })
    ]);

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("[USER_VERIFICATION_ERROR]:", error);
    const msg = error instanceof Error ? error.message : "Verification failed";
    return { success: false, message: msg };
  }
}

/**
 * Approves a Specific Car Listing for the Public Showroom
 */
export async function approveCarListing(carId: string) {
  try {
    await checkAdmin(); // Security Gate

    await db.car.update({
      where: { id: carId },
      data: { listingStatus: "APPROVED" },
    });

    // Revalidate paths to drop cache layout constraints immediately across targets
    revalidatePath("/admin/dashboard"); 
    revalidatePath("/dashboard");       
    revalidatePath("/cars");          
    revalidatePath(`/cars/${carId}`);
    
    return { success: true };
  } catch (error: unknown) {
    console.error("[CAR_APPROVAL_ERROR]:", error);
    const msg = error instanceof Error ? error.message : "Failed to approve listing";
    return { success: false, message: msg };
  }
}

/**
 * Rejects a Car Listing
 */
export async function rejectCarListing(carId: string) {
  try {
    await checkAdmin(); // Security Gate

    await db.car.update({
      where: { id: carId },
      data: { listingStatus: "REJECTED" },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("[CAR_REJECTION_ERROR]:", error);
    const msg = error instanceof Error ? error.message : "Failed to reject listing";
    return { success: false, message: msg };
  }
}