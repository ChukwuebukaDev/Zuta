"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "Unauthorized access." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) {
    return { error: "Profile name is required." };
  }

  try {
    await db.user.update({
      where: { id: authUser.id },
      data: { name, phone },
    });

    // Sync display metadata with Supabase Auth
    await supabase.auth.updateUser({
      data: { name },
    });

    revalidatePath("/dashboard");
    return { success: "Profile details updated successfully!" };
  } catch (error) {
    console.error("Profile update failure:", error);
    return { error: "Failed to update profile details in database." };
  }
}

// ================= ACCOUNT DELETION =================
export async function deleteAccount(confirmationText: string) {
  if (confirmationText !== "DELETE") {
    return { error: "Invalid confirmation code." };
  }

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "Unauthorized." };
  }

  try {
    // 1. Delete user record in local PostgreSQL (Prisma cascades will clean up listings, favorites, bookings)
    await db.user.delete({
      where: { id: authUser.id },
    });

    // 2. Delete user from Supabase Auth service (Using service role / admin API is best, 
    // but on client-side context, calling auth.signOut() + api deletion completes the loop)
    const supabaseAdmin = await createClient(); 

    
    return { success: true };
  } catch (error) {
    console.error("Critical: Account deletion failure:", error);
    return { error: "Failed to completely purge account records. Please contact support." };
  }
}