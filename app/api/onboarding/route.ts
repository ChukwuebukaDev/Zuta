import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId, legalName, documents } = await req.json()

    const request = await db.verificationRequest.create({
      data: {
        userId,
        legalName,
        status: "SUBMITTED",
        documents: {
          create: documents.map((doc: any) => ({
            type: doc.type,
            url: doc.url
          }))
        }
      }
    })

    return NextResponse.json(request)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}