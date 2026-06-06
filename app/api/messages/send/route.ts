import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized. Please log in to message sellers.", { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new NextResponse("Invalid request body payload", { status: 400 });
    }

    const { carId, text } = body;
    // We intentionally ignore the incoming body's sellerId to guarantee security

    if (!carId || !text || !text.trim()) {
      return new NextResponse("Missing required fields: carId and text are mandatory.", { status: 400 });
    }

    // 1. Fetch the vehicle directly to grab the real seller ID registered in your database
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        id: true,
        userId: true,   // 👈 Change this to match your schema's actual relation key (userId or sellerId)
        // sellerId: true 
      }
    });

    if (!car) {
      return new NextResponse("This car listing no longer exists in the Zuta catalog.", { status: 404 });
    }

    // 2. Identify the true, secure target owner account id string
    const actualSellerId = car.userId; // or car.sellerId depending on your exact schema

    if (!actualSellerId) {
      return new NextResponse("This listing is not securely mapped to a valid dealer profile.", { status: 400 });
    }

    // 3. Block self-talk messaging pipelines
    if (user.id === actualSellerId) {
      return new NextResponse("Action Denied: You cannot message yourself about your own listing.", { status: 400 });
    }

    // 4. Find or Create Conversation using the verified DB parameters
    let conversation = await prisma.conversation.findUnique({
      where: {
        carId_buyerId_sellerId: {
          carId,
          buyerId: user.id,
          sellerId: actualSellerId
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          carId,
          buyerId: user.id,
          sellerId: actualSellerId
        }
      });
    }

    // 5. Securely save message payload entry record
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        text: text.trim()
      }
    });

    return NextResponse.json(message);

  } catch (error) {
    console.error("[ZUTA_MESSAGE_ROUTER_CRASH]:", error);
    const internalDetails = error instanceof Error ? error.message : String(error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        trace: internalDetails 
      }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}    