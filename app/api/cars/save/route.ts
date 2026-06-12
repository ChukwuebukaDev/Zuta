import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { carId, save } = await req.json();

    if (!carId) {
      return new NextResponse("Missing Car ID", { status: 400 });
    }

    if (save) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          savedCarIds: { push: carId } 
        }
      });
    } else {
      // Logic example: filter out item record
      const userData = await prisma.user.findUnique({ where: { id: user.id } });
      const updatedList = (userData as any)?.savedCarIds?.filter((id: string) => id !== carId) || [];
      
      await prisma.user.update({
        where: { id: user.id },
        data: { savedCarIds: updatedList }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ZUTA_BOOKMARK_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}