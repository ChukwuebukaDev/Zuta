import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_PER_MINUTE = 10;

class TurnLockError extends Error {}
class RateLimitError extends Error {}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized access sign in to continue." }, { status: 401 });
    }

    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const { carId, text } = body as { carId?: string; text?: string };

    if (typeof carId !== "string" || !carId.trim()) {
      return NextResponse.json({ error: "Invalid carId." }, { status: 400 });
    }

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    const cleanText = text.replace(/\s+/g, " ").trim();
    if (cleanText.length === 0 || cleanText.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: clerkUser.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Complete account setup before messaging." }, { status: 403 });
    }

    // Fetch the listing to determine the REAL seller securely
    const listing = await prisma.car.findUnique({
      where: { id: carId },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const sellerId = listing.userId;

    // Prevent users from messaging their own cars
    if (sellerId === dbUser.id) {
      return NextResponse.json({ error: "Cannot message your own listing." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Find or create conversation using the structurally guaranteed seller ID
      const conversation = await tx.conversation.upsert({
        where: {
          carId_buyerId_sellerId: {
            carId,
            buyerId: dbUser.id,
            sellerId,
          },
        },
        update: { updatedAt: new Date() },
        create: {
          carId,
          buyerId: dbUser.id,
          sellerId,
        },
        select: { id: true },
      });

      // Rate limit check
      const oneMinuteAgo = new Date(Date.now() - 60_000);
      const recentCount = await tx.message.count({
        where: {
          senderId: dbUser.id,
          createdAt: { gte: oneMinuteAgo },
        },
      });

      if (recentCount >= MAX_MESSAGES_PER_MINUTE) {
        throw new RateLimitError();
      }

      // Turn enforcement check
      const lastMessage = await tx.message.findFirst({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "desc" },
        select: { senderId: true },
      });

      if (lastMessage?.senderId === dbUser.id) {
        throw new TurnLockError();
      }

      // Safe to create message
      return tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: dbUser.id,
          text: cleanText,
        },
        select: {
          id: true,
          conversationId: true,
          text: true,
          createdAt: true,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof TurnLockError) {
      return NextResponse.json(
        { error: "It is not your turn to send a message in this conversation." },
        { status: 403 }
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: "Too many messages. Try again shortly." }, { status: 429 });
    }

    console.error("[MESSAGE_ROUTE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}