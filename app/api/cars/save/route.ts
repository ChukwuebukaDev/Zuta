import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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
              // Safe catch wrapper for Route Handler environments
            }
          },
        },
      }
    );

    // 2. Validate authentication context state
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    if (!supabaseUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { carId, save } = await req.json();

    if (!carId) {
      return new NextResponse("Missing Car ID", { status: 400 });
    }

    // 3. Mutate the relational Favorite table based on user intent
    if (save) {
      // Create a join record. we use upsert to cleanly prevent double-click primary key conflicts
      await db.favorite.upsert({
        where: {
          userId_carId: {
            userId: supabaseUser.id,
            carId: carId,
          },
        },
        create: {
          userId: supabaseUser.id,
          carId: carId,
        },
        update: {}, // Do nothing on duplicate, preventing DB constraint crashes!
      });
    } else {
      // Cleanly delete the relational bookmark connection if it exists
      await db.favorite.deleteMany({
        where: {
          userId: supabaseUser.id,
          carId: carId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ZUTA_BOOKMARK_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}