import { auth } from "@clerk/nextjs/server"
import { prisma as db } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { 
      role: true, 
      isVerified: true,
      onboardingComplete: true 
    }
  })

  // 1. If they aren't verified, they shouldn't be in the dashboard area
  if (!user?.isVerified) {
    // If they finished the form, send to status. If not, send to the form.
    if (user?.onboardingComplete) {
      redirect("/onboarding/status")
    } else {
      redirect("/onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* You can add a Sidebar or Navbar here later */}
      {children}
    </div>
  )
}