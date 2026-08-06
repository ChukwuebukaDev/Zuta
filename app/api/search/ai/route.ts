import { NextResponse } from "next/server";
import { interpretSearchQuery } from "@/lib/ai/search";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Search prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    const filters = await interpretSearchQuery(prompt);

    return NextResponse.json({
      success: true,
      filters,
    });

  } catch (error) {
    console.error("[AI_SEARCH]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process search.",
      },
      {
        status: 500,
      }
    );
  }
}