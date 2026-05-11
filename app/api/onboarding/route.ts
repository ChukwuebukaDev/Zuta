import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, legalName, documents } = body;

    if (!userId || !legalName || !documents || !Array.isArray(documents)) {
      return new NextResponse("Missing required onboarding data", { status: 400 });
    }

    const idUrl = documents.find((d: any) => d.type === "GOVT_ID")?.url;
    const cardUrl = documents.find((d: any) => d.type === "BUSINESS_CARD")?.url;

    if (!idUrl || !cardUrl) {
      return new NextResponse("Both Identity and Business files are required", { status: 400 });
    }

const updatedUser = await prisma.user.upsert({
  where: { 
    id: userId 
  },
  update: {
    legalName: legalName,
    onboardingComplete: true,
    idUrl: idUrl,
    cardUrl: cardUrl,
  },
  create: {
    id: userId, // This ensures the Clerk ID is saved as the Primary Key
    legalName: legalName,
    onboardingComplete: true,
    idUrl: idUrl,
    cardUrl: cardUrl,
  },
});
    console.log("✅ [ONBOARDING_SUCCESS]: User updated", updatedUser.id);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[ONBOARDING_ERROR]:", error);

    if (error.code === 'P2025') {
      return new NextResponse("User not found in database", { status: 404 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}