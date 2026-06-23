import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent, UserJSON } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Clerk automatically reads process.env.CLERK_WEBHOOK_SIGNING_SECRET from .env
    const evt = (await verifyWebhook(req)) as WebhookEvent;
    
    const eventType = evt.type;
    const data = evt.data;
console.log("[CLERK_WEBHOOK_RECEIVED]", { eventType, data });
    // Fast path out if webhook is not associated with core user structures
    if (!eventType.startsWith("user.")) {
      return NextResponse.json(
        { success: true, message: "Ignored unrelated structural webhook event" }, 
        { status: 200 }
      );
    }

    // Cast data safely to UserJSON to access core fields without explicit 'any' blocks
    const userData = data as UserJSON;
    const clerkId = userData.id;

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: "Missing Clerk user correlation identifier" },
        { status: 400 }
      );
    }

    // 2. Process Account Sync Mutations (Creates and Profile Updates)
    if (eventType === "user.created" || eventType === "user.updated") {
      
      // Isolate the user's primary selected contact fields cleanly
      const primaryEmail =
        userData.email_addresses?.find(
          (email) => email.id === userData.primary_email_address_id
        )?.email_address ??
        userData.email_addresses?.[0]?.email_address ??
        null;

      const primaryPhone =
        userData.phone_numbers?.find(
          (phone) => phone.id === userData.primary_phone_number_id
        )?.phone_number ??
        userData.phone_numbers?.[0]?.phone_number ??
        null;

      const fullName =
        [userData.first_name, userData.last_name].filter(Boolean).join(" ").trim() ||
        null;

      // Extract metadata safely from Clerk configuration objects
      const metadata = userData.public_metadata as { role?: string } | undefined;
      const rawMetadataRole = metadata?.role?.toUpperCase();
      
      // Standardize incoming role metadata parameters to fit strict application database Enums
      const resolvedRole = 
        rawMetadataRole === "DEALER" || rawMetadataRole === "SELLER" 
          ? "DEALER" 
          : rawMetadataRole === "ADMIN" 
          ? "ADMIN" 
          : "BUYER";

      // Write atomically to database. Prevents identity drop logs on profile context updates
      const user = await prisma.user.upsert({
        where: { id: clerkId },
        update: {
          name: fullName ?? undefined,
          email: primaryEmail ?? undefined,
          phone: primaryPhone ?? undefined,
          role: resolvedRole, 
        },
        create: {
          id: clerkId,
          name: fullName,
          email: primaryEmail,
          phone: primaryPhone,
          role: resolvedRole,
          isVerified: false,
          onboardingComplete: false,
          savedCarIds: [],
        },
      });

      console.log("[CLERK_SYNC_OK]", { 
        event: eventType, 
        userId: user.id, 
        activeRole: user.role 
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 3. Process Account Removals
    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: { id: clerkId },
      });

      console.log("[CLERK_DELETE_OK]", clerkId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error: unknown) {
    console.error("[CLERK_WEBHOOK_CRASH]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server security error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}