"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

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

// export async function verifyUser(targetUserId: string, status: boolean) {
//   try {
//     await checkAdmin(); 

//     await db.$transaction([
//       db.user.update({
//         where: { id: targetUserId },
//         data: { isVerified: status },
//       }),
//       db.dealerProfile.updateMany({
//         where: { userId: targetUserId },
//         data: { status: status ? DealerStatus.APPROVED : DealerStatus.PENDING }
//       })
//     ]);

//     revalidatePath("/admin-dashboard");
//     return { success: true };
//   } catch (error: unknown) {
//     console.error("[USER_VERIFICATION_ERROR]:", error);
//     const msg = error instanceof Error ? error.message : "Verification failed";
//     return { success: false, message: msg };
//   }
// }


export async function approveCarListing(carId: string) {
  try {
    await checkAdmin(); 
    await db.car.update({
      where: { id: carId },
      data: { 
        listingStatus: "APPROVED",
        publishedAt: new Date(),
      },
    });

    // Revalidate paths to drop cache layout constraints immediately across targets
    revalidatePath("/admin-dashboard"); 
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
/**
 * Rejects a Car Listing with categorized reason and feedback notes
 */
export async function rejectCarListing(
  carId: string,
  payload: { reason: string; feedback: string }
) {
  try {
    await checkAdmin();

    await db.car.update({
      where: { id: carId },
      data: {
        listingStatus: "REJECTED",
        rejectionReason: payload.reason,
        adminFeedback: payload.feedback,
        rejectedAt: new Date(),
      },
    });

    // Revalidate affected routes to immediately update UI caches
    revalidatePath("/admin-dashboard");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath(`/cars/${carId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("[CAR_REJECTION_ERROR]:", error);
    const msg = error instanceof Error ? error.message : "Failed to reject listing";
    return { success: false, message: msg };
  }
}