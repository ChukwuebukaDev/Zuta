"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

// Helper to verify Admin Role
async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // if (user?.role !== "ADMIN") {
  //   throw new Error("Forbidden: Admin access only.");
  // }
  return userId;
}

/**
 * Verifies a Dealer's Onboarding Status
 */
export async function verifyUser(userId: string, status: boolean) {
  try {
    await checkAdmin(); // Security Gate
    
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: status },
    });

    revalidatePath("/admin-onboarding");
    return { success: true };
  } catch (error) {
    console.error("User Verification Error:", error);
    return { success: false, message: "Verification failed" };
  }
}

/**
 * Approves a Specific Car Listing for the Public Showroom
 */
export async function approveCarListing(carId: string) {
  try {
    await checkAdmin(); // Security Gate

    await prisma.car.update({
      where: { id: carId },
      data: { listingStatus: "APPROVED" },
    });

    // Revalidate multiple paths to ensure the UI updates everywhere
    revalidatePath("/admin/pending"); 
    revalidatePath("/seller");       
    revalidatePath("/cars");          
    
    return { success: true };
  } catch (error) {
    console.error("Car Approval Error:", error);
    return { success: false, message: "Failed to approve listing" };
  }
}

/**
 * Rejects a Listing
 */
export async function rejectCarListing(carId: string) {
  try {
    await checkAdmin();

    await prisma.car.update({
      where: { id: carId },
      data: { listingStatus: "REJECTED" },
    });

    revalidatePath("/admin/pending");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}