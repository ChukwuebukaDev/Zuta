import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const cookieStore = await cookies();

    // 1. Initialize the official Supabase SSR Server Client inside Route Handler
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
              // Safe catch wrapper for Edge runtime or Route Handler environment quirks
            }
          },
        },
      }
    );

    // 2. Extract authenticated user session context
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    console.log("GET /api/messages/[carId] - Current User UUID:", supabaseUser?.id);    
    
    // 3. Extract carId by awaiting the params promise wrapper
    const { carId } = await params;
    console.log("GET /api/messages/[carId] - Car ID:", carId);

    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Find the conversation for this car matching the Supabase User ID string
    const conversation = await db.conversation.findFirst({
      where: {
        carId,
        OR: [
          { buyerId: supabaseUser.id },
          { sellerId: supabaseUser.id }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ exists: false, messages: [] });
    }

    return NextResponse.json({
      conversation,
      exists: true,
      conversationId: conversation.id,
      messages: conversation.messages,
      canMessage: true, 
      whoseTurn: "YOU", 
      consecutiveCount: 0 
    });

  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]:", error);
    return NextResponse.json({ error: "Failed to load chat." }, { status: 500 });
  }
}