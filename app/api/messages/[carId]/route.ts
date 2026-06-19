import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ carId: string }> } // ✅ Changed to Promise
) {
 
  try {
    const clerkUser = await currentUser();
    console.log("GET /api/messages/[carId] - Current User:", clerkUser);    
    
    // ✅ Extract carId by awaiting the params promise
    const { carId } = await params;
    console.log("GET /api/messages/[carId] - Car ID:", carId);

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find the conversation for this car and the current user
    const conversation = await prisma.conversation.findFirst({
      where: {
        carId,
        OR: [
          { buyerId: clerkUser.id },
          { sellerId: clerkUser.id }
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
