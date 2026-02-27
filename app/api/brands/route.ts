import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json",
      { next: { revalidate: 86400 } } // cache 24h
    );

    const data = await res.json();

    // vPIC returns {Results: [{Make_ID, Make_Name}, ...]}
    return NextResponse.json(data.Results);
  } catch (err) {
    console.error("Failed to fetch brands:", err);
    return NextResponse.json([], { status: 200 });
  }
}