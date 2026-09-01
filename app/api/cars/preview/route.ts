import { NextResponse } from "next/server";
import { BodyType } from "@prisma/client";
import { getCars } from "@/lib/engine/marketplace";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const bodyType = searchParams.get("bodyType");

    if (!bodyType) {
      return NextResponse.json(
        { error: "bodyType is required" },
        { status: 400 }
      );
    }

    if (!Object.values(BodyType).includes(bodyType as BodyType)) {
      return NextResponse.json(
        { error: "Invalid bodyType" },
        { status: 400 }
      );
    }

    const result = await getCars({
      bodyType: bodyType as BodyType,
      page: 1,
      pageSize: 12,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[CAR_PREVIEW_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to load car listings" },
      { status: 500 }
    );
  }
}