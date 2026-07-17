import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const make = searchParams.get("make");
    const year = searchParams.get("year");

    // 1. Enforce strict parameter validation matching your frontend cascade
    if (!make || !year) {
      return NextResponse.json(
        { error: "Missing required query parameters: make and year are mandatory." }, 
        { status: 400 }
      );
    }

    // 2. Query the official NHTSA database to fetch all legal models for this manufacturer + year combination
    const targetUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
    
    const response = await fetch(targetUrl, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 } // Cache this for 24 hours to prevent spamming the public API
    });

    if (!response.ok) {
      throw new Error(`NHTSA Endpoint returned status code: ${response.status}`);
    }

    const data = await response.json();
    
    // 3. Extract and map the model names into a simple flat string array
    const rawResults = data.Results || [];
    const sanitizedModels: string[] = rawResults
      .map((item: any) => item.Model_Name)
      .filter((name: string | null) => name !== null && name.trim() !== "");

    // Remove duplicates safely using a Set context wrapper
    const uniqueModels = Array.from(new Set(sanitizedModels));

    // 4. Return the clean list directly to your ModelSelect menu
    return NextResponse.json(uniqueModels, { status: 200 });

  } catch (error) {
    console.error("ZUTA_SPEC_DESK_ROUTE_ERROR:", error);
    
    const errorDetails = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to pull manufacture catalog arrays.", details: errorDetails }, 
      { status: 500 }
    );
  }
}