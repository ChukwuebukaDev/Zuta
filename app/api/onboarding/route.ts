import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { createClient } from "@/supabase/server";

interface IncomingDocument {
  type: "GOVT_ID" | "BUSINESS_CARD" | "CAC_CERTIFICATE";
  url: string;
}

interface OnboardingRequestBody {
  businessName: string;
  phone: string;
  cacNumber: string;
  businessAddress: string;
  tagline?: string;
  documents: IncomingDocument[];
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized Session" }, { status: 401 });
    }

    const body: OnboardingRequestBody = await req.json();
    const { businessName, cacNumber, businessAddress, tagline, documents, phone } = body;

    // Fast validation safety check
    if (!businessName || !cacNumber || !businessAddress || !documents || documents.length < 2) {
      return NextResponse.json({ message: "Missing required profile credentials" }, { status: 400 });
    }

    const govtIdUrl = documents.find((d) => String(d.type).toUpperCase() === "GOVT_ID")?.url;
    const businessCardUrl = documents.find((d) => String(d.type).toUpperCase() === "BUSINESS_CARD")?.url;

    if (!govtIdUrl || !businessCardUrl) {
      return NextResponse.json({ message: "Required documentation files missing" }, { status: 400 });
    }

    // Generate a unique marketplace landing identifier
    const businessSlug = `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).substring(2, 6)}`;

    // Atomic transaction execution blocks webhook interruption entirely
    const updatedUser = await db.$transaction(async (tx) => {
      return await tx.user.update({
        where: { id: user.id },
        data: {
          role: "DEALER",
          onboardingComplete: true, // Elevates listing portal clearance
          phone: phone.trim(),
          
          // 🌟 FIXED: Removed 'legalName', 'idUrl', and 'cardUrl' from root User write
          dealerProfile: {
            create: {
              businessName,
              slug: businessSlug,
              phone: phone.trim(),
              tagline: tagline || null,
              logo: businessCardUrl,
              // 'status' auto-defaults to DRAFT via Prisma schema
            }
          },

          verificationRequest: {
            create: {
              legalName: businessName,
              businessAddress,
              cacNumber,
              // 'status' auto-defaults to SUBMITTED via Prisma schema
              documents: {
                create: documents.map((doc) => ({
                  type: String(doc.type).toUpperCase() as any, 
                  url: doc.url,
                }))
              }
            }
          }
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: "Dealership configurations fully committed.",
      user: updatedUser 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[DEALER_ONBOARDING_CRASH]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal processing failure";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}