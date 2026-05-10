import { auth } from "@clerk/nextjs/server"
import {prisma as db } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, isVerified: true }
  })

  // If they aren't a dealer yet, send them back to see their status
  if (user?.role !== "DEALER") {
    redirect("/onboarding/status")
  }

  return <div className="min-h-screen bg-[#050505]">{children}</div>
}