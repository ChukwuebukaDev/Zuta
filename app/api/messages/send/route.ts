import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_PER_MINUTE = 10;

class TurnLockError extends Error {}
class RateLimitError extends Error {}

export async function POST(req: Request) {
  try {
    // 1. Authentication
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized access. Sign in to continue." }, { status: 401 });
    }

    // 2. Body Parser Guard
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

    // 3. Sync Clerk user with Database Profile
    const dbUser = await prisma.user.findUnique({
      where: { id: clerkUser.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Complete account setup before messaging." }, { status: 403 });
    }

    let targetConversationId = conversationId;
    let needsTimestampUpdate = false;

    // SCENARIO A: Existing Conversation Channel
    if (targetConversationId) {
      const activeConversation = await prisma.conversation.findUnique({
        where: { id: targetConversationId },
        select: { buyerId: true, sellerId: true },
      });

      if (!activeConversation) {
        return NextResponse.json({ error: "Conversation channel not found." }, { status: 404 });
      }

      if (activeConversation.buyerId !== dbUser.id && activeConversation.sellerId !== dbUser.id) {
        return NextResponse.json({ error: "Forbidden access to this conversation desk." }, { status: 403 });
      }
      
      // Only existing chats need an explicit conversation timestamp touch later
      needsTimestampUpdate = true;
    } 
    // SCENARIO B: First-time setup initiated by buyer
    else if (carId) {
      const listing = await prisma.car.findUnique({
        where: { id: carId },
        select: { userId: true },
      });

      if (!listing) {
        return NextResponse.json({ error: "Listing not found." }, { status: 404 });
      }

      const sellerId = listing.userId;

      if (sellerId === dbUser.id) {
        return NextResponse.json({ error: "Cannot message your own listing." }, { status: 400 });
      }

      // Upsert atomically handles the creation/update timeline
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

    // 4. Critical Section Execution (Transactions)
    const result = await prisma.$transaction(async (tx) => {
      const oneMinuteAgo = new Date(Date.now() - 60_000);
      
      // Rate limit evaluation
      const recentCount = await tx.message.count({
        where: {
          senderId: dbUser.id,
          createdAt: { gte: oneMinuteAgo },
        },
      });

      if (recentCount >= MAX_MESSAGES_PER_MINUTE) {
        throw new RateLimitError();
      }

      // Turn enforcement using raw PostgreSQL/MySQL lock for true serializability protection
      // This prevents parallel button-mashing bypasses
      const lastMessages = await tx.$queryRaw<{ senderId: string }[]>`
        SELECT "senderId" FROM "Message" 
        WHERE "conversationId" = ${targetConversationId} 
        ORDER BY "createdAt" DESC 
        LIMIT 1 
        FOR UPDATE
      `;

      const lastMessage = lastMessages[0];

      if (lastMessage?.senderId === dbUser.id) {
        throw new TurnLockError();
      }

      // Secure payload deployment
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

    // 5. Update parent metadata only if it wasn't already updated by the Scenario B upsert
    if (needsTimestampUpdate) {
      await prisma.conversation.update({
        where: { id: targetConversationId },
        data: { updatedAt: new Date() }
      }).catch(err => console.error("Non-blocking conversation timestamp touch failed:", err));
    }

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