import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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

    // 3. Handle mutating the array inside your database using the Supabase UUID string
    if (save) {
      await db.user.update({
        where: { id: supabaseUser.id },
        data: {
          savedCarIds: { push: carId } 
        }
      });
    } else {
      // Pull down existing array layout and filter target car string out
      const userData = await db.user.findUnique({ 
        where: { id: supabaseUser.id },
        select: { savedCarIds: true }
      });
      
      const updatedList = userData?.savedCarIds?.filter((id: string) => id !== carId) || [];
      
      await db.user.update({
        where: { id: supabaseUser.id },
        data: { savedCarIds: updatedList }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ZUTA_BOOKMARK_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}