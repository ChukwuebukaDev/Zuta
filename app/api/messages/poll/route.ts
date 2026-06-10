import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const lastChecked = searchParams.get("lastChecked");

    if (!conversationId || !lastChecked) {
      return new NextResponse("Missing query parameters", { status: 400 });
    }

    // Secure check: Make sure the requesting user belongs to this conversation room
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true }
    });

    if (!conversation) return new NextResponse("Conversation not found", { status: 404 });
    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch only the messages created *after* the client's last synchronization timestamp
    const newMessages = await prisma.message.findMany({
      where: {
        conversationId,
        createdAt: {
          gt: new Date(lastChecked)
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(newMessages);
  } catch (error) {
    console.error("[ZUTA_POLLING_ENGINE_CRASH]:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new NextResponse(errorMessage, { status: 500 });
  }
}