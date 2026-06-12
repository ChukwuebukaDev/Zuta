import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGES_PER_POLL = 100;

export async function GET(req: Request) {
  try {
    // 1. Authenticate the active user session profile via Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const lastChecked = searchParams.get("lastChecked");

    // 2. Validate required parameters are present
    if (!conversationId || !lastChecked) {
      return NextResponse.json(
        { error: "conversationId and lastChecked are required fields." },
        { status: 400 }
      );
    }

    // 3. Validate timestamp string integrity
    const parsedDate = new Date(lastChecked);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid lastChecked ISO timestamp formatting received." },
        { status: 400 }
      );
    }

    // 4. Verify the conversation room exists and extract membership boundaries
    const conversation = await prisma.conversation.findUnique({
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

    // Guard: Block multi-tenant traffic if user id doesn't match ledger credentials
    const isParticipant =
      conversation.buyerId === user.id ||
      conversation.sellerId === user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden: Security exception. Access denied." },
        { status: 403 }
      );
    }

    // 5. Query for unread ledgers appended past the historical sync line
    const messages = await prisma.message.findMany({
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