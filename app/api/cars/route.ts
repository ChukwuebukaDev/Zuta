import { prisma } from "@/lib/prisma";
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

  condition: z.enum(["NEW", "USED","CERTIFIED"]),

  accidentHistory: z.coerce.boolean().default(false),
  serviceHistory: z.coerce.boolean().default(false),

  price: z.coerce.number().positive(),
  negotiable: z.coerce.boolean().default(false),

  thumbnail: z.string().url(),
  images: z.array(z.string().url()).min(1),

  sellerName: z.string().min(1),
  sellerPhone: z.string().min(7).max(20),
  sellerEmail: z.string().email().optional().nullable(),

  location: z.string().min(1),
});


function generateSlug(brand: string, model: string) {
  return `${brand}-${model}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400 }
      );
    }

    const result = carSchema.safeParse(body);
    console.log("VALIDATION RESULT:", result);
    if (!result.success) {
      console.error("ZOD ERROR:", result.error.flatten());

      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.error.flatten(),
        }),
        { status: 400 }
      );
    }

    const data = result.data;

    const car = await prisma.car.create({
      data: {
        slug: generateSlug(data.brand, data.model),
        title: `${data.brand} ${data.model}`,

        brand: data.brand,
        model: data.model,
        year: data.year,
        bodyType: data.bodyType,

        transmission: data.transmission,
        fuelType: data.fuelType,
        drivetrain: data.drivetrain,
        color: data.color,

        mileage: data.mileage,
        condition: data.condition,

        accidentHistory: data.accidentHistory,
        serviceHistory: data.serviceHistory,

        price: data.price,
        currency: "NGN",
        negotiable: data.negotiable,

        thumbnail: data.thumbnail,

        status: "AVAILABLE",
        featured: false,
        views: 0,

        sellerName: data.sellerName,
        sellerPhone: data.sellerPhone,
        sellerEmail: data.sellerEmail ?? null,
        location: data.location,

        // userId: null,

        carImages: {
          create: data.images.map((url) => ({ url })),
        },
      },
      include: {
        carImages: true,
      },
    });

    return new Response(
      JSON.stringify({
        ...car,
        images: car.carImages.map((img) => img.url),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("PRISMA/SERVER ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);

    const skip = (page - 1) * limit;

    const carsFromDb = await prisma.car.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { carImages: true },
    });

    const cars = carsFromDb.map(({ carImages, ...car }) => ({
      ...car,
      images: carImages.map((img) => img.url),
    }));

    return new Response(JSON.stringify(cars), { status: 200 });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch cars" }),
      { status: 500 }
    );
  }
}