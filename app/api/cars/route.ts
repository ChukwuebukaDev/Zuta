import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Validation Schema
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
  images: z.array(z.string().url()).min(1),
  sellerName: z.string().min(1),
  sellerPhone: z.string().min(7).max(20),
  sellerEmail: z.string().email().optional().nullable(),
  location: z.string().min(1), // Expected: "City, State"
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
    // Check if the dealer is logged in
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // --- OPTION 1: Smart Location Splitting ---
    // Takes "Lekki, Lagos" and splits into city/state
    const locationParts = data.location.split(",").map((s) => s.trim());
    const city = locationParts[0] || "Unknown";
    const state = locationParts[1] || "Lagos";

    // Create the car in the database
    const car = await prisma.car.create({
      data: {
        slug: generateSlug(data.brand, data.model),
        title: `${data.year} ${data.brand} ${data.model}`, // Professional title
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
        
        // Location Data
        city,
        state,
        country: "Nigeria",

        // Seller Data
        sellerName: data.sellerName,
        sellerPhone: data.sellerPhone,
        sellerEmail: data.sellerEmail,

        // The Dealer Link
        userId: userId,

        // Nested image creation
        carImages: {
          create: data.images.map((url) => ({ url })),
        },
      },
      include: { carImages: true },
    });

    return NextResponse.json(car, { status: 201 });

  } catch (error) {
    console.error("SERVER_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // For filtering by dealer
    
    const cars = await prisma.car.findMany({
      where: userId ? { userId } : {},
      include: { carImages: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}