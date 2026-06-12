import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    // 1. Authenticate user profile session via Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to message sellers." },
        { status: 401 }
      );
    }

    // Parse body safely
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload layout received." },
        { status: 400 }
      );
    }

    const { carId, text } = body;

    // 2. Strict Input Content Validations
    if (typeof carId !== "string" || !carId.trim()) {
      return NextResponse.json({ error: "Invalid or missing carId." }, { status: 400 });
    }

    if (typeof text !== "string") {
      return NextResponse.json({ error: "Message text must be a valid string value." }, { status: 400 });
    }

    const cleanText = text.trim();

    if (!cleanText) {
      return NextResponse.json({ error: "Message content cannot be blank." }, { status: 400 });
    }

    if (cleanText.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message content limits exceeded: max ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 3. Server-Side Identity & Existing Conversation Resolution
    const carListing = await prisma.car.findUnique({
      where: { id: carId },
      select: { userId: true },
    });

    if (!carListing) {
      return NextResponse.json(
        { error: "This car listing no longer exists on our servers." },
        { status: 404 }
      );
    }

    const targetSellerId = carListing.userId;

    if (!targetSellerId) {
      return NextResponse.json(
        { error: "Listing integrity exception: target map lacks a verified dealer owner." },
        { status: 400 }
      );
    }

    // ⚙️ SMART CHECK: Look for an existing conversation room before blocking the request
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        carId,
        OR: [
          { buyerId: user.id },
          { sellerId: user.id }
        ]
      }
    });

    // If NO conversation exists yet, this is a brand new chat initialization attempt
    if (!existingConversation) {
      // Prevent a seller from starting a brand new thread on their own asset
      if (targetSellerId === user.id) {
        return NextResponse.json(
          { error: "Security Restriction: You cannot launch negotiations or message your own listing." },
          { status: 400 }
        );
      }
    }

    // Determine the true participant mappings for the upsert query block
    // If the room exists, keep its historical roles intact. If not, the current user is the buyer.
    const finalBuyerId = existingConversation ? existingConversation.buyerId : user.id;
    const finalSellerId = existingConversation ? existingConversation.sellerId : targetSellerId;

    // Double check that the sender is actually authorized to post in this room
    if (user.id !== finalBuyerId && user.id !== finalSellerId) {
      return NextResponse.json({ error: "Unauthorized: You are not a participant in this chat room." }, { status: 403 });
    }

    // 4. Execute Atomic Relational Database Transactions
    const savedMessage = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.upsert({
        where: {
          carId_buyerId_sellerId: {
            carId,
            buyerId: finalBuyerId,
            sellerId: finalSellerId,
          },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          carId,
          buyerId: finalBuyerId,
          sellerId: finalSellerId,
        },
      });

      // Append the new message entry directly inside the isolated room
      return tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          text: cleanText,
        },
        select: {
          id: true,
          conversationId: true,
          senderId: true,
          text: true,
          createdAt: true,
        }
      });
    });

    return NextResponse.json(savedMessage, { status: 201 });

  } catch (error) {
    console.error("[ZUTA_MESSAGE_ROUTE_ERROR]:", error);

    const errorDetails = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Secure Desk was unable to route transaction message.", details: errorDetails },
      { status: 500 }
    );
  }
}