import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { make: string } }
) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${params.make}?format=json`,
      { next: { revalidate: 86400 } } // cache 24h
    );

    const data = await res.json();

    // vPIC returns {Results: [{Make_Name, Model_Name}, ...]}
    return NextResponse.json(data.Results);
  } catch (err) {
    console.error("Failed to fetch models for make:", params.make, err);
    return NextResponse.json([], { status: 200 });
  }
}