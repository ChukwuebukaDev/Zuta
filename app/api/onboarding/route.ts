import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your Prisma client location

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, legalName, documents } = body;

    // 1. Validation: Ensure all required pieces are present
    if (!userId || !legalName || !documents || !Array.isArray(documents)) {
      return new NextResponse("Missing required onboarding data", { status: 400 });
    }

    // 2. Extract URLs from the documents array sent by the frontend
    const idUrl = documents.find((d: any) => d.type === "GOVT_ID")?.url;
    const cardUrl = documents.find((d: any) => d.type === "BUSINESS_CARD")?.url;

    // 3. Final safety check: Ensure we actually have the URLs
    if (!idUrl || !cardUrl) {
      return new NextResponse("Both Identity and Business files are required", { status: 400 });
    }

    // 4. Update the database record
    // Ensure you have run 'npx prisma db push' with the new fields
    const updatedUser = await prisma.user.update({
      where: { 
        id: userId 
      },
      data: {
        legalName: legalName,
        onboardingComplete: true,
        idUrl: idUrl,
        cardUrl: cardUrl,
        // Optional: If you want to automatically set them to verified 
        // upon submission (or leave as false for admin review)
        isVerified: false, 
      },
    });

    console.log("✅ [ONBOARDING_SUCCESS]: User updated", updatedUser.id);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    // Log the full error to your terminal for debugging
    console.error("[ONBOARDING_ERROR]:", error);

    // Handle the case where the user ID doesn't exist in the DB
    if (error.code === 'P2025') {
      return new NextResponse("User not found in database", { status: 404 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}