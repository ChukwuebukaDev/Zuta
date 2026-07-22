import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCarBySlug } from "@/lib/engine/marketplace";
import CarDetailsView from "@/components/sell/cars/CarDetailsView";

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

  const serializedCar = {
    ...car,
    price: Number(car.price),
    fuelCapacity: Number(car.fuelCapacity) ?? 50, 
  horsePower: Number(car.horsePower) ?? 150,
  trim:car.trim ?? "",
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
  return <CarDetailsView car={serializedCar} currentUserId={currentUserId} />;
}