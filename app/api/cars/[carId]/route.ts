import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

// Helper for dynamic SEO Slugs on make/model updates
function generateSlug(brand: string, model: string) {
  return `${brand}-${model}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ carId: string }> | { carId: string } }
) {
  try {
    const cookieStore = await cookies();

    // 1. Initialize Supabase SSR Client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Safe catch wrapper for Route Handler environments
            }
          },
        },
      }
    );

    // 2. Validate authentication context state
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    if (!supabaseUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Resolve the route params unpacking
    const resolvedParams = await params;
    const { carId } = resolvedParams;
    const body = await req.json();

    // 4. Verify listing ownership boundary
    const existingCar = await db.car.findUnique({
      where: { id: carId }
    });

    if (!existingCar) return new NextResponse("Listing not found", { status: 404 });
    if (existingCar.userId !== supabaseUser.id) return new NextResponse("Forbidden", { status: 403 });

    // 5. Build dynamic mutations safely
    const updatedBrand = body.brand || existingCar.brand;
    const updatedModel = body.model || existingCar.model;
    const hasBrandOrModelChanged = 
      updatedBrand.toLowerCase() !== existingCar.brand.toLowerCase() || 
      updatedModel.toLowerCase() !== existingCar.model.toLowerCase();

    // Re-generate SEO slug only if brand or model parameters shift
    const slug = hasBrandOrModelChanged 
      ? generateSlug(updatedBrand, updatedModel) 
      : existingCar.slug;

    // Normalizing incoming enum strings to prevent capitalization write crashes
    const transmission = body.transmission ? String(body.transmission).toUpperCase() : undefined;
    const fuelType = body.fuelType ? String(body.fuelType).toUpperCase() : undefined;
    const condition = body.condition ? String(body.condition).toUpperCase() : undefined;

    // Safe comparison: Convert Prisma Decimal price to a standard Javascript Number
    const existingPrice = Number(existingCar.price);
    const incomingPrice = Number(body.price);
    const hasPriceChanged = existingPrice !== incomingPrice;

    // 6. Perform the update mutation securely 
    const updatedCar = await db.car.update({
      where: { id: carId },
      data: {
        brand: updatedBrand,
        model: updatedModel,
        slug,
        title: `${Number(body.year)} ${updatedBrand} ${updatedModel}`,
        year: Number(body.year),
        price: incomingPrice,
        mileage: Number(body.mileage),
        color: body.color,
        bodyType: body.bodyType,
        drivetrain: body.drivetrain,
        transmission: transmission as any,
        fuelType: fuelType as any,
        condition: condition as any,
        negotiable: Boolean(body.negotiable),
        
        // Keep standard listing availability status (AVAILABLE, SOLD) consistent
        status: existingCar.status,
        listingStatus: hasPriceChanged ? "PENDING" : existingCar.listingStatus
      }
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("[ZUTA_EDIT_MUTATION_CRASH]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}