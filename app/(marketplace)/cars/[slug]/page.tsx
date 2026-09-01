import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCarBySlug } from "@/lib/engine/marketplace";
import CarDetailsView from "@/components/sell/cars/CarDetailsView";
import { prisma } from "@/lib/prisma";
type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function CarDetailsPage({ params }: Props) {
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
            // Next.js server mutation fallback safety block
          }
        },
      },
    }
  );

  // 2. Fetch authenticated session to determine active user context or fallback to guest string
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id || "user_guest";
 
  // 3. Resolve the asynchronous layout parameter unpacking safely
  const resolvedParams = await params;
  const car = await getCarBySlug(resolvedParams.slug);
  if (!car) {
    notFound();
  }

const user = await prisma.user.findUnique({
  where: {
    id: car.userId,
  },
  include: {
    cars: true,
  },
});

if (!user) {
  notFound();
}

const serializedUser = {
  ...user,

  cars: user.cars.map((sellerCar) => ({
    ...sellerCar,

    // Prisma Decimal → number
    price: Number(sellerCar.price),

    fuelCapacity:
      sellerCar.fuelCapacity != null
        ? Number(sellerCar.fuelCapacity)
        : 50,

    horsePower:
      sellerCar.horsePower != null
        ? Number(sellerCar.horsePower)
        : 150,

    trim: sellerCar.trim ?? "",
    engineSize: sellerCar.engineSize ?? "",

    // Dates → strings
    createdAt:
      sellerCar.createdAt instanceof Date
        ? sellerCar.createdAt.toISOString()
        : sellerCar.createdAt,

    updatedAt:
      sellerCar.updatedAt instanceof Date
        ? sellerCar.updatedAt.toISOString()
        : sellerCar.updatedAt,

    publishedAt:
      sellerCar.publishedAt instanceof Date
        ? sellerCar.publishedAt.toISOString()
        : sellerCar.publishedAt ?? null,

    expiresAt:
      sellerCar.expiresAt instanceof Date
        ? sellerCar.expiresAt.toISOString()
        : sellerCar.expiresAt ?? null,

    soldAt:
      sellerCar.soldAt instanceof Date
        ? sellerCar.soldAt.toISOString()
        : sellerCar.soldAt ?? null,

    archivedAt:
      sellerCar.archivedAt instanceof Date
        ? sellerCar.archivedAt.toISOString()
        : sellerCar.archivedAt ?? null,

    rejectedAt:
      sellerCar.rejectedAt instanceof Date
        ? sellerCar.rejectedAt.toISOString()
        : sellerCar.rejectedAt ?? null,
  })),
};

  const serializedCar = {
    ...car,
    price: Number(car.price),
    fuelCapacity: Number(car.fuelCapacity) ?? 50, 
  horsePower: Number(car.horsePower) ?? 150,
  trim:car.trim ?? "",
  description:car.description ?? "",
  engineSize:car.engineSize ?? "",
    // Process Dates to plain ISO strings safely, verifying optional fields first
    createdAt: car.createdAt instanceof Date ? car.createdAt.toISOString() : car.createdAt,
    updatedAt: car.updatedAt instanceof Date ? car.updatedAt.toISOString() : car.updatedAt,
    publishedAt: car.publishedAt instanceof Date ? car.publishedAt.toISOString() : car.publishedAt || null,
    expiresAt: car.expiresAt instanceof Date ? car.expiresAt.toISOString() : car.expiresAt || null,
    soldAt: car.soldAt instanceof Date ? car.soldAt.toISOString() : car.soldAt || null,
    archivedAt: car.archivedAt instanceof Date ? car.archivedAt.toISOString() : car.archivedAt || null,
    
    // Process nested images array if present to ensure complete serialization
    carImages: car.carImages?.map((img: string) => img) || [],
  };

  // 5. Feed the completely serialized plain object representation into the view layout
  return <CarDetailsView car={serializedCar} user={serializedUser} currentUserId={currentUserId} />;
}