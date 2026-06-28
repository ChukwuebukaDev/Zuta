import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";
import { z } from "zod";

const carSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  color: z.string().min(1),
  year: z.coerce.number().int().gte(1900).lte(new Date().getFullYear()),
  bodyType: z.string().min(1),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]),
  drivetrain: z.string().min(1),
  mileage: z.coerce.number().int().nonnegative(),
  condition: z.enum(["NEW", "USED", "CERTIFIED"]),
  accidentHistory: z.coerce.boolean().default(false),
  serviceHistory: z.coerce.boolean().default(false),
  price: z.coerce.number().positive(),
  negotiable: z.coerce.boolean().default(false),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).min(6, "Minimum of 6 structural perspective photos required."),
  sellerName: z.string().min(1),
  sellerPhone: z.string().transform((val) => val.trim() === "" ? "080-ZUTA-DEALER" : val).optional(),
  sellerEmail: z.string().email().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

// Helper for SEO Slugs
function generateSlug(brand: string, model: string) {
  return `${brand}-${model}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
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
              // Safe catch wrapper for Route Handler execution environments
            }
          },
        },
      }
    );

    // 2. Validate authentication context state
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized. Account validation failed." }, { status: 401 });
    }

    const body = await req.json();
    
    const result = carSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify none of the core 6 slots contain null or empty strings
    const mandatorySlotsComplete = data.images.slice(0, 6).every((url) => typeof url === "string" && url.trim() !== "");
    if (!mandatorySlotsComplete) {
      return new NextResponse("Validation Error: Missing mandatory angle urls inside array bounds.", { status: 400 });
    }

    const structuralOrder: ("FRONT" | "REAR" | "LEFT" | "RIGHT" | "INTERIOR" | "UNDERNEATH")[] = [
      "FRONT",      
      "REAR",       
      "LEFT",       
      "RIGHT",      
      "INTERIOR",   
      "UNDERNEATH"  
    ];

    // Atomic transaction for the listing data entry structures
    const newCarListing = await db.$transaction(async (tx) => {
      const car = await tx.car.create({
        data: {
          slug: generateSlug(data.brand, data.model),
          title: `${data.year} ${data.brand} ${data.model}`, 
          brand: data.brand,
          model: data.model,
          year: data.year,
          color: data.color,
          bodyType: data.bodyType,
          transmission: data.transmission,
          fuelType: data.fuelType,
          drivetrain: data.drivetrain,
          mileage: data.mileage,
          condition: data.condition,
          accidentHistory: data.accidentHistory,
          serviceHistory: data.serviceHistory,
          price: data.price,
          negotiable: data.negotiable,
          thumbnail: data.thumbnail,
          city: data.city,
          state: data.state,
          country: data.country,
          sellerName: data.sellerName,
          sellerPhone: data.sellerPhone,
          sellerEmail: data.sellerEmail,
          userId: supabaseUser.id,
          carImages: {
            create: data.images.map((url, idx) => ({
              url,
              angle: idx < 6 ? structuralOrder[idx] : "OPTIONAL"
            })),
          },
        },
        include: { carImages: true },
      });

      return car; 
    });

    return NextResponse.json(newCarListing, { status: 201 });

  } catch (error) {
    console.error("SERVER_ERROR:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    
    const cars = await db.car.findMany({
      where: userId ? { userId } : {},
      include: { carImages: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch inventory rows.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}