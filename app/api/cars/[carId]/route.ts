import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ carId: string }> | { carId: string } }
) {
  try {
    const cookieStore = await cookies();

    // 1. Initialize the official Supabase SSR Server Client
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
              // Safe catch wrapper for Route Handler execution context quirks
            }
          },
        },
      }
    );

    // 2. Authenticate the active user session profile via Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    if (!supabaseUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Resolve the asynchronous parameters layout unpacking
    const resolvedParams = await params;
    const { carId } = resolvedParams;
    const body = await req.json();

    // 4. Verify listing ownership boundary using the Supabase UUID string
    const existingCar = await db.car.findUnique({
      where: { id: carId }
    });

    if (!existingCar) return new NextResponse("Listing not found", { status: 404 });
    if (existingCar.userId !== supabaseUser.id) return new NextResponse("Forbidden", { status: 403 });

    // 5. Perform the update mutation securely
    const updatedCar = await db.car.update({
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