import { NextResponse } from "next/server";
import { interpretSearchQuery } from "@/app/modules/ai-search/search/interpret";
import { searchCars } from "@/app/modules/ai-search/search/search-cars";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Search prompt is required.",
        },
        { status: 400 }
      );
    }

    // Understand the user's language
    const intent = await interpretSearchQuery(
      prompt.trim()
    );

    // Find + rank actual Zuta inventory
    const results = await searchCars(intent);

    return NextResponse.json({
      success: true,
      intent,
      results,
    });
  } catch (error) {
    console.error("[AI_SEARCH]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process search.",
      },
      { status: 500 }
    );
  }
}