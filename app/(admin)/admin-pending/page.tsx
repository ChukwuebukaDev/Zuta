import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { PendingCarRow } from "@/components/admin/PendingCarRow"

export default async function AdminPendingPage() {
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
            // Safe catch wrapper
          }
        },
      },
    }
  );

  // 2. Authenticate session state
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // 3. Enforce Admin boundaries
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/");
  }

  // 4. Query complete car fields needed for the inspection modal
  const pendingCars = await db.car.findMany({
    where: { listingStatus: "PENDING" },
    include: {
      carImages:true,
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // 5. Serialize Decimal and Date primitives for Client Component consumption
  const serializedCars = JSON.parse(JSON.stringify(pendingCars));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
        Pending <span className="text-amber-500">Approvals</span>
      </h1>

      <div className="grid gap-4">
        {serializedCars.map((car: any) => (
          <PendingCarRow key={car.id} car={car} />
        ))}

        {serializedCars.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-[2rem]">
            <p className="text-slate-500 italic text-sm">
              No vehicles currently awaiting review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}