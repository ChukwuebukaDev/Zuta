import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import EditCarForm from "@/components/dashboard/EditCarForm";

interface EditCarPageProps {
  params: Promise<{ carId: string }> | { carId: string };
}

export default async function EditCarPage({ params }: EditCarPageProps) {
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

  // 2. Authenticate the session via Supabase SSR
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const supabaseUser = session.user;

  // 3. Handle asynchronous params layout unpacking safely
  const resolvedParams = await params;
  const { carId } = resolvedParams;

  // 4. Fetch the car listing and its gallery images from Prisma
  const rawCar = await db.car.findUnique({
    where: { id: carId },
    include: {
      carImages: true, // ⚡ Includes uploaded gallery photo models
    },
  });

  if (!rawCar) notFound();

  // 5. Guard clause: Ensure the Supabase UUID matches the record's uploader ID
  if (rawCar.userId !== supabaseUser.id) {
    redirect("/dashboard");
  }

  // ⚡ 6. Serialize Prisma Decimal & Date instances into plain JSON primitives
  const car = JSON.parse(JSON.stringify(rawCar));

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-zinc-950 min-h-screen text-slate-100 rounded-3xl border border-slate-900">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Modify <span className="text-amber-500">Listing</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Updating critical fields like price or status will automatically place your listing under admin review.
        </p>
      </div>

      <EditCarForm car={car} />
    </div>
  );
}