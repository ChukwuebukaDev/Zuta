import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");


    if (!make || !model || !year) {
      return NextResponse.json({ error: "Missing criteria values" }, { status: 400 });
    }

  
    const response = await fetch(`https://api.api-ninjas.com/v1/cardetails?make=${make}&model=${model}&trim=1.6%20AT%20(101%20hp)
`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Api-Key": `${process.env.CAR_API_KEY}`
      },
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      throw new Error(`External CarAPI down. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("CarAPI Response Data:", data);
    // Grabs the primary trim or configuration array element block safely
    const baseTrim = data.data?.[0] || {};

    // 2. Transmit clean standard specifications directly back to the frontend container grid
    return NextResponse.json({
      make: baseTrim.make_model?.make?.name || make,
      model: baseTrim.make_model?.name || model,
      year: baseTrim.year || year,
      bodyType: baseTrim.body_type || "Premium Vehicle",
      driveType: baseTrim.drive_type || "FWD Standard",
      engineProfile: baseTrim.engine_type ? `${baseTrim.engine_type} ${baseTrim.engine_cylinders || ""}` : "Factory Tuned Engine",
      fuelType: baseTrim.fuel_type || "Petrol / Gas",
    });

  } catch (error) {
    console.error("ZUTA_CAR_API_PROXY_ERROR:", error);
    return NextResponse.json({ error: "External fetch failure maps." }, { status: 500 });
  }
}