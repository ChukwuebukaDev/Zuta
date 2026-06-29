import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");


  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/cars");
  }

  return <>{children}</>;
}