import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {  prisma} from "@/lib/prisma"; 
import { z } from "zod";

const carSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  color: z.string().min(1),
  year: z.coerce.number().int().gte(1900).lte(new Date().getFullYear()),
  bodyType: z.string().min(1),
  transmission: z.preprocess((val) => String(val).toUpperCase(), z.enum(["MANUAL", "AUTOMATIC"])),
  fuelType: z.preprocess((val) => String(val).toUpperCase(), z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"])),
  condition: z.preprocess((val) => String(val).toUpperCase(), z.enum(["NEW", "USED", "CERTIFIED"])),
  drivetrain: z.string().min(1),
  mileage: z.coerce.number().int().nonnegative(),
  accidentHistory: z.coerce.boolean().default(false),
  serviceHistory: z.coerce.boolean().default(false),
  price: z.coerce.number().positive(),
  negotiable: z.coerce.boolean().default(false),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).min(6, "Minimum of 6 structural perspective photos required."),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

function generateSlug(brand: string, model: string) {
  return `${brand}-${model}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    // 1. Initialize Supabase SSR
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
            } catch {}
          },
        },
      }
    );

    // 2. Validate User Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Account validation failed." }, { status: 401 });
    }

    // 3. Parse and Validate Request Body
    const body = await req.json();
    const result = carSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify 6 structural photos
    const mandatorySlotsComplete = data.images.slice(0, 6).every((url) => typeof url === "string" && url.trim() !== "");
    if (!mandatorySlotsComplete) {
      return NextResponse.json({ error: "Validation Error: Missing mandatory angle URLs." }, { status: 400 });
    }

    const structuralOrder: ("FRONT" | "REAR" | "LEFT" | "RIGHT" | "INTERIOR" | "UNDERNEATH")[] = [
      "FRONT", "REAR", "LEFT", "RIGHT", "INTERIOR", "UNDERNEATH"
    ];

    // 4. ⚡ ATOMIC TRANSACTION: Check, Decrement Limit, and Create Listing
    const newCarListing = await prisma.$transaction(async (tx) => {
      
      // A. Fetch user limit metrics securely inside the transaction block
      const dbUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { privateListingLimit: true }
      });

      if (!dbUser) {
        throw new Error("User record not found in database.");
      }

      // B. Block the request if they have run out of listing credits
      if (dbUser.privateListingLimit <= 0) {
        throw new Error("You have 0 remaining listings left on your account.");
      }

      // C. Update the user record to decrement their listing limit by 1
      await tx.user.update({
        where: { id: user.id },
        data: {
          privateListingLimit: {
            decrement: 1
          }
        }
      });

      // D. Write the actual car listing to the database
      return tx.car.create({
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
          userId: user.id,
          carImages: {
            create: data.images.map((url, idx) => ({
              url,
              angle: idx < 6 ? structuralOrder[idx] : "OPTIONAL"
            })),
          },
        },
        include: { carImages: true },
      });
    });

    return NextResponse.json(newCarListing, { status: 201 });

  } catch (error) {
    console.error("SERVER_ERROR:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    
    // Check if it was our custom limit block throwing the error
    if (msg.includes("remaining listings") || msg.includes("User record not found")) {
      return NextResponse.json({ error: msg }, { status: 403 });
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}