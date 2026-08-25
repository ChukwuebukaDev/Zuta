import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { createClient } from "@/supabase/server";
import { supabaseAdmin } from "@/supabase/admin";

interface IncomingDocument {
  type: "GOVT_ID" | "BUSINESS_CARD" | "CAC_CERTIFICATE";
  url: string;
}

interface OnboardingRequestBody {
  businessName: string;
  businessEmail?: string;
  phone: string;
  cacNumber: string;
  businessAddress: string;
  tagline?: string;
  documents: IncomingDocument[];
}

export async function POST(req: Request) {
  try {
    // ============================================================
    // 1. Validate authenticated Supabase session
    // ============================================================
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized session." },
        { status: 401 }
      );
    }

    // ============================================================
    // 2. Parse incoming onboarding payload
    // ============================================================
    const body: OnboardingRequestBody = await req.json();

    const {
      businessName,
      phone,
      cacNumber,
      businessAddress,
      tagline,
      documents,
    } = body;

    // ============================================================
    // 3. Validate required fields
    // ============================================================
    if (
      !businessName ||
      !phone ||
      !cacNumber ||
      !businessAddress ||
      !documents ||
      documents.length < 2
    ) {
      return NextResponse.json(
        {
          message: "Missing required dealership information.",
        },
        { status: 400 }
      );
    }

    const govtIdUrl = documents.find(
      (doc) => doc.type === "GOVT_ID"
    )?.url;

    const businessCardUrl = documents.find(
      (doc) => doc.type === "BUSINESS_CARD"
    )?.url;

    if (!govtIdUrl || !businessCardUrl) {
      return NextResponse.json(
        {
          message: "Required verification documents are missing.",
        },
        { status: 400 }
      );
    }

    // ============================================================
    // 4. Generate a unique public dealership slug
    // ============================================================
    const businessSlug = `${businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    // ============================================================
    // 5. Prisma Transaction
    //
    // Prisma remains the PRIMARY source of truth.
    // If any nested write fails, everything rolls back.
    // ============================================================
    const updatedUser = await db.$transaction(async (tx) => {
      return tx.user.update({
        where: {
          id: user.id,
        },

        data: {
          role: "DEALER",
          onboardingComplete: true,
          phone: phone.trim(),

          dealerProfile: {
            create: {
              businessName,
              slug: businessSlug,
              phone: phone.trim(),
              tagline: tagline || null,
              logo: businessCardUrl,
            },
          },

          verificationRequest: {
            create: {
              legalName: businessName,
              businessAddress,
              cacNumber,

              documents: {
                create: documents.map((doc) => ({
                  type: doc.type,
                  url: doc.url,
                })),
              },
            },
          },
        },
      });
    });

    // ============================================================
    // 6. Synchronize Supabase Auth metadata
    //
    // Proxy runs on the Edge and cannot efficiently query Prisma.
    // Therefore we mirror important authorization fields into
    // Supabase Auth user_metadata.
    // ============================================================
    const { error: metadataError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          role: updatedUser.role,
          onboardingComplete: updatedUser.onboardingComplete,
        },
      });

    if (metadataError) {
      console.error(
        "[SUPABASE_METADATA_SYNC_FAILED]",
        metadataError
      );

      return NextResponse.json(
        {
          message:
            "Dealer account was created, but authentication metadata failed to synchronize.",
        },
        { status: 500 }
      );
    }

    // ============================================================
    // 7. Success
    // ============================================================
    return NextResponse.json(
      {
        success: true,
        message: "Dealer onboarding completed successfully.",
        user: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("[DEALER_ONBOARDING_CRASH]", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}