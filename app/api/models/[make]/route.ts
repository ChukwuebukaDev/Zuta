import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ make: string }> }
) {
  const brand = await params;
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${brand.make}?format=json`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    return NextResponse.json(data.Results);
  } catch (err) {
    console.error("Failed to fetch models for make:", brand.make, err);
    return NextResponse.json([], { status: 200 });
  }
}