"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SubmitVerificationData {
  legalName: string;
  documents: { type: "GOVT_ID" | "BUSINESS_CARD"; url: string }[];
}

export async function submitVerification(data: SubmitVerificationData) {
  const cookieStore = await cookies();

  // 1. Initialize the official Supabase SSR Server Client for Server Actions
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Next.js server actions handle cookie updates natively, 
            // but this safe catch wrapper blocks runtime warning logs.
          }
        },
      },
    }
  );

  // 2. Validate authentication context state
  const { data: { session } } = await supabase.auth.getSession();
  const supabaseUser = session?.user;

  if (!supabaseUser) {
    throw new Error("You must be logged in to submit a request.");
  }

  try {
    // 3. Process database writes atomically using the Supabase UUID string
    await db.$transaction(async (tx) => {
      // Create the main verification entry linked to the user's UUID
      const request = await tx.verificationRequest.create({
        data: {
          userId: supabaseUser.id,
          legalName: data.legalName,
          status: "SUBMITTED",
        },
      });

      // Attach the physical document URLs to the database map
      await tx.verificationDocument.createMany({
        data: data.documents.map((doc) => ({
          type: doc.type,
          url: doc.url,
          requestId: request.id,
        })),
      });
    });

    // 4. Flush the Next.js data cache for the onboarding dashboard view
    revalidatePath("/seller/onboarding");
    return { success: true };
    
  } catch (error) {
    console.error("[ZUTA_ONBOARDING_SUBMIT_ERROR]:", error);
    return { success: false, error: "Failed to submit request" };
  }
}