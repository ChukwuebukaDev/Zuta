"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createServiceBooking(data: {
  providerId: string;
  scheduledAt: Date;
  notes?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized Session" };
    }

    const booking = await db.booking.create({
      data: {
        userId: user.id,
        providerId: data.providerId,
        scheduledAt: data.scheduledAt,
        notes: data.notes,
      },
    });

    revalidatePath("/dashboard/profile"); // Flush buyer profile open desks cache
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("[ZUTA_SERVICE_BOOKING_ERROR]:", error);
    return { success: false, error: "Failed to schedule service appointment" };
  }
}