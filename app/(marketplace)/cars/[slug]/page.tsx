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

  // 4. Feed both fields into the refactored view layout
  return <CarDetailsView car={car} currentUserId={currentUserId} />;
}