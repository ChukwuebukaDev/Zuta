import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 1️⃣ Define the schema with Zod
const carSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().gte(1900).lte(new Date().getFullYear()),
  bodyType: z.string().min(1),
  transmission: z.string().min(1),
  fuelType: z.string().min(1),
  drivetrain: z.string().min(1),
  mileage: z.coerce.number().int().nonnegative(),
  condition: z.string().min(1),
  accidentHistory: z.coerce.boolean().optional().default(false),
  serviceHistory: z.coerce.boolean().optional().default(false),
  price: z.coerce.number().positive(),
  negotiable: z.coerce.boolean().default(false),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sellerName: z.string().min(1),
  sellerPhone: z.string().min(1),
  sellerEmail: z.string().email().optional().nullable(),
  location: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // 2️⃣ Parse & validate request body
    const body = await req.json();
    const data = carSchema.parse(body);

    // 3️⃣ Generate a clean slug
    const slug = `${data.brand}-${data.model}-${Date.now()}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    // 4️⃣ Create the car in Prisma
    const car = await prisma.car.create({
      data: {
        slug,
        title: `${data.brand} ${data.model}`,
        brand: data.brand,
        model: data.model,
        year: data.year,
        bodyType: data.bodyType,
        transmission: data.transmission,
        fuelType: data.fuelType,
        drivetrain: data.drivetrain,
        mileage: data.mileage,
        condition: data.condition,
        accidentHistory: data.accidentHistory ?? null,
        serviceHistory: data.serviceHistory ?? null,
        price: data.price,
        currency: "NGN",
        negotiable: data.negotiable,
        thumbnail: data.thumbnail,
        carImages: {
          create: data.images.map((url) => ({
            url,
          })),
        },
        status: "available",
        featured: false,
        views: 0,
        sellerName: data.sellerName,
        sellerPhone: data.sellerPhone,
        sellerEmail: data.sellerEmail ?? null,
        location: data.location,
      },
    });

    return new Response(JSON.stringify(car), { status: 201 });
  } catch (error) {
    // 5️⃣ Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.flatten() }), {
        status: 400,
      });
    }

    console.error(error);

    return new Response(JSON.stringify({ error: "Failed to create car" }), {
      status: 500,
    });
  }
}

// catch (error: any) {
//   console.error("FULL ERROR:", error);

//   return new Response(
//     JSON.stringify({
//       error: error.message,
//       stack: error.stack, // optional (for dev only)
//     }),
//     { status: 500 }
//   );
// }
