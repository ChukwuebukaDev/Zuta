import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ role: "BUYER" }, { status: 400 });

    const user = await db.user.findUnique({
      where: { id },
      select: { role: true }
    });

    return NextResponse.json({ role: user?.role || "BUYER" }, { status: 200 });
  } catch {
    return NextResponse.json({ role: "BUYER" }, { status: 500 });
  }
}