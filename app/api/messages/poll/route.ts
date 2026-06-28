import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma as db } from "@/lib/prisma";

const MAX_MESSAGES_PER_POLL = 100;

export async function GET(req: Request) {
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
              // Safe catch wrapper for Route Handler environment execution quirks
            }
          },
        },
      }
    );

    // 2. Authenticate the active user session profile via Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUser = session?.user;

    if (!supabaseUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const lastChecked = searchParams.get("lastChecked");

    // 3. Validate required parameters are present
    if (!conversationId || !lastChecked) {
      return NextResponse.json(
        { error: "conversationId and lastChecked are required fields." },
        { status: 400 }
      );
    }

    // 4. Validate timestamp string integrity
    const parsedDate = new Date(lastChecked);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid lastChecked ISO timestamp formatting received." },
        { status: 400 }
      );
    }

    // 5. Verify the conversation room exists and extract membership boundaries
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: {
        buyerId: true,
        sellerId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Negotiation workspace room not found." },
        { status: 404 }
      );
    }

    // Guard: Block multi-tenant traffic if Supabase UUID doesn't match ledger credentials
    const isParticipant =
      conversation.buyerId === supabaseUser.id ||
      conversation.sellerId === supabaseUser.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden: Security exception. Access denied." },
        { status: 403 }
      );
    }

    // 6. Query for unread ledgers appended past the historical sync line
    const messages = await db.message.findMany({
      where: {
        conversationId,
        createdAt: {
          gt: parsedDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: MAX_MESSAGES_PER_POLL,
      select: {
        id: true,
        senderId: true,
        text: true,
        createdAt: true,
      },
    });

    // 🚀 Stream raw array payload straight back to satisfy client mapping blocks
    return NextResponse.json(messages);

  } catch (error) {
    console.error("[ZUTA_MESSAGE_POLL_ERROR]:", error);

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to pull recent counter offer entries.", details: errorMessage },
      { status: 500 }
    );
  }
}