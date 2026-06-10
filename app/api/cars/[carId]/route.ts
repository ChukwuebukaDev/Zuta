import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ carId: string }> | { carId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const resolvedParams = await params;
    const { carId } = resolvedParams;
    const body = await req.json();

    // 1. Verify ownership boundary
    const existingCar = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!existingCar) return new NextResponse("Listing not found", { status: 404 });
    if (existingCar.userId !== user.id) return new NextResponse("Forbidden", { status: 403 });

    // 2. Perform the update mutation securely
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        brand: body.brand,
        model: body.model,
        year: Number(body.year),
        price: Number(body.price),
        mileage: Number(body.mileage),
        transmission: body.transmission,
        fuelType: body.fuelType,
        condition: body.condition,
        // location: body.location,
        // If critical parameters shift, automatically toggle status back to review protocol
        listingStatus: existingCar.price !== Number(body.price) ? "PENDING" : existingCar.listingStatus
      }
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("[ZUTA_EDIT_MUTATION_CRASH]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}