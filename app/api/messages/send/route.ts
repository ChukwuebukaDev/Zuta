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

    const { carId, conversationId, text } = body as { carId?: string; conversationId?: string; text?: string };

    if ((typeof carId !== "string" || !carId.trim()) && (typeof conversationId !== "string" || !conversationId.trim())) {
      return NextResponse.json({ error: "Provide either carId or conversationId." }, { status: 400 });
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

    let targetConversationId = conversationId;

    // SCENARIO A: Replying directly to an ongoing chat from the Dashboard Feed
    if (targetConversationId) {
      const activeConversation = await prisma.conversation.findUnique({
        where: { id: targetConversationId },
        select: { buyerId: true, sellerId: true },
      });

      if (!activeConversation) {
        return NextResponse.json({ error: "Conversation channel not found." }, { status: 404 });
      }

      // Security check: Verify user is a legitimate participant in this conversation
      if (activeConversation.buyerId !== dbUser.id && activeConversation.sellerId !== dbUser.id) {
        return NextResponse.json({ error: "Forbidden access to this conversation desk." }, { status: 403 });
      }
    } 
    // SCENARIO B: First-time setup initiated by a buyer from a product details card
    else if (carId) {
      const listing = await prisma.car.findUnique({
        where: { id: carId },
        select: { userId: true },
      });

      if (!listing) {
        return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      }

      const sellerId = listing.userId;

      // Prevent users from starting an inquiry chat with their own cars
      if (sellerId === dbUser.id) {
        return NextResponse.json({ error: "Cannot message your own listing." }, { status: 400 });
      }

      // Atomically locate or initiate the conversation model structure
      const conv = await prisma.conversation.upsert({
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
      
      targetConversationId = conv.id;
    }

    // Process messaging execution securely inside a controlled transaction sequence
    const result = await prisma.$transaction(async (tx) => {
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
        where: { conversationId: targetConversationId },
        orderBy: { createdAt: "desc" },
        select: { senderId: true },
      });

      if (lastMessage?.senderId === dbUser.id) {
        throw new TurnLockError();
      }

      // Create message 
      return tx.message.create({
        data: {
          conversationId: targetConversationId!,
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

    // Touch conversation to update timestamps outside the critical section tracking sequence
    await prisma.conversation.update({
      where: { id: targetConversationId },
      data: { updatedAt: new Date() }
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