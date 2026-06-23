import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// 💡 Define explicit types for incoming request structure
interface IncomingDocument {
  type: "GOVT_ID" | "BUSINESS_CARD";
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
    // 1. Verify authentication state
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized Session" }, { status: 401 });
    }

    // 2. Extract structured and typed payloads passed from the client form
    const body: OnboardingRequestBody = await req.json();
    console.log("[ONBOARDING_PAYLOAD_RECEIVED]:", body);
    const { 
      businessName, 
      cacNumber, 
      businessAddress, 
      tagline, 
      documents ,
      phone,
    } = body;

    // Strict validation check fallback
    if (!businessName || !cacNumber || !businessAddress || !documents || documents.length < 2) {
      return NextResponse.json({ message: "Missing required profile credentials" }, { status: 400 });
    }

    // 💡 Completely Type-Safe URL Extractor
    const govtIdUrl = documents.find((d) => d.type === "GOVT_ID")?.url;
    const businessCardUrl = documents.find((d) => d.type === "BUSINESS_CARD")?.url;

    if (!govtIdUrl || !businessCardUrl) {
      return NextResponse.json({ message: "Required documentation files missing" }, { status: 400 });
    }

    // 3. Database Atomicity: Run nested update write execution
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        role: "DEALER", 
        onboardingComplete: true,
        isVerified: false, 
        phone: phone.trim(),
        
        dealerProfile: {
          create: {
            businessName,
            slug: businessName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, ""),
          
            phone: phone.trim(),
           
            tagline: tagline || null,
            logo: businessCardUrl,         
          
          }
        }
      }
    });
await db.verificationRequest.create({
  data: {
    userId,

    legalName: businessName,

    documents: {
      create: [
        {
          type: "GOVT_ID",
          url: govtIdUrl,
        },

        {
          type: "BUSINESS_CARD",
          url: businessCardUrl,
        },
      ],
    },
  },
});
    // 4. THE CLERK SYNC: Update Clerk Metadata via the Backend SDK
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "DEALER"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Dealership registry parameters committed successfully",
      user: updatedUser 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[DEALER_ONBOARDING_CRASH]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal database sync error occurred";
    return NextResponse.json(
      { message: errorMessage }, 
      { status: 500 }
    );
  }
}