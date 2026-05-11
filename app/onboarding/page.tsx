import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/prisma"
import OnboardingForm from "@/components/forms/OnboardingForm"
import { Car, Shield, Clock, Zap } from "lucide-react"

export default async function OnboardingPage() {
  // 1. Authenticate the session
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  const dbUser = await db.user.findUnique({
    where: { id: userId },
    select: { 
      onboardingComplete: true, 
      isVerified: true 
    }
  })

  if (dbUser?.isVerified) {
    redirect("/dashboard")
  }

  if (dbUser?.onboardingComplete) {
    redirect("/onboarding/status")
  }

  // 4. If they reach this point, they need to fill out the form
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-x-hidden">
      {/* Background Grid & Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] md:opacity-5" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.2) 25%, rgba(59, 130, 246, 0.2) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.2) 75%, rgba(59, 130, 246, 0.2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.2) 25%, rgba(59, 130, 246, 0.2) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.2) 75%, rgba(59, 130, 246, 0.2) 76%, transparent 77%, transparent)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-1/4 -left-1/4 w-[100%] md:w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[100%] md:w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="backdrop-blur-md bg-slate-950/40 border-b border-slate-800/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 group">
              <div className="relative p-1.5 md:p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg md:rounded-xl shadow-lg">
                <Car className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent">ZUTA</span>
            </div>
            <div className="text-[10px] md:text-sm text-slate-400 font-medium tracking-wider uppercase">Dealer Portal</div>
          </div>
        </nav>

        <div className="px-4 py-12 md:py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            
            {/* Animated Badge */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm animate-pulse">
                <Zap size={14} className="text-blue-400" />
                <span className="text-[10px] md:text-sm font-medium text-blue-200">Exclusive Dealer Network</span>
              </div>
            </div>

            {/* Heading Area */}
            <div className="text-center space-y-4 md:space-y-6 mb-10 md:mb-16">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
                Unlock Your <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  Premium Status
                </span>
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Verify your business identity to access our high-intent luxury buyer network.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-16">
              {[
                { icon: Shield, label: "Verified Only", desc: "Premium buyer network" },
                { icon: Clock, label: "48h Approval", desc: "Fast-track verification" },
                { icon: Zap, label: "Instant Reach", desc: "Live market access" }
              ].map((benefit, idx) => (
                <div key={idx} className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 p-4 rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                  <benefit.icon className="w-5 h-5 text-blue-400 sm:mb-3 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-xs md:text-sm">{benefit.label}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Container */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-[2rem] blur-2xl pointer-events-none" />
              <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl md:rounded-[2rem] p-6 md:p-12 backdrop-blur-xl shadow-2xl">
                <div className="mb-8 pb-6 border-b border-slate-800/60 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Dealer Application</h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">Upload required documents to proceed</p>
                </div>

                <OnboardingForm
                  userId={userId}
                  userEmail={clerkUser?.emailAddresses[0].emailAddress || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}