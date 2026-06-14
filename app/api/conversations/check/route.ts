import { prisma as db } from "@/lib/prisma"; // Adjust this to point to your Prisma instance
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Extract query parameters from the URL string
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");

    if (!carId) {
      return new NextResponse("Missing carId parameter", { status: 400 });
    }

    // 2. Query Supabase for an existing thread involving this car and the active user
    const conversation = await db.conversation.findFirst({
      where: {
        carId: carId,
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        car: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnailUrl: true, // Adjust fields to match your schema
            sellerId: true
          }
        },
        messages: {
          orderBy: {
            createdAt: "asc" // Kept ascending to read like a script timeline
          }
        }
      }
    });

    // 3. If no thread exists yet, return empty but let the UI know it's clear to start one
    if (!conversation) {
      return NextResponse.json({
        exists: false,
        conversation: null,
        whoseTurn: "BUYER", 
        canMessage: true
      });
    }

    // 4. Calculate dynamic turn-taking state parameters
    const totalMessages = conversation.messages.length;
    const lastMessage = totalMessages > 0 ? conversation.messages[totalMessages - 1] : null;
    
    let whoseTurn: "YOU" | "THEM" | "NONE" = "YOU";
    let consecutiveCount = 0;

    if (!lastMessage) {
      whoseTurn = "YOU"; // Brand new conversation framework
    } else {
      whoseTurn = lastMessage.senderId === userId ? "THEM" : "YOU";

      // 5. Anti-Spam Gate Engine: Count how many messages back-to-back this user sent
      for (let i = totalMessages - 1; i >= 0; i--) {
        if (conversation.messages[i].senderId === userId) {
          consecutiveCount++;
        } else {
          break; // Hit a message from the other party, stop counting
        }
      }
    }

    // Enforce anti-spam: Block if you've sent 3 messages in a row without a response
    const canMessage = consecutiveCount < 3;

    // 6. Return the full custom analytical payload
    return NextResponse.json({
      exists: true,
      conversationId: conversation.id,
      carContext: conversation.car,
      messages: conversation.messages,
      whoseTurn,
      canMessage,
      consecutiveCount
    });

  } catch (error) {
    console.error("[CONVERSATION_CHECK_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}