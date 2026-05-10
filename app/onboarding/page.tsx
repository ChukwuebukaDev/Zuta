import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/prisma"
import OnboardingForm from "@/components/forms/OnboardingForm"
import { Car, Shield, Clock, Zap } from "lucide-react"

export default async function OnboardingPage() {
  // 1. Authenticate the user via Clerk
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) redirect("/sign-in")

  // 2. Check Database for existing records
  const existingRequest = await db.verificationRequest.findUnique({
    where: { userId },
    select: { status: true }
  })

  // 3. Handle Redirect Logic based on application status
  if (existingRequest?.status === "APPROVED") {
    redirect("/dashboard")
  }

  if (existingRequest?.status === "SUBMITTED") {
    redirect("/onboarding/status")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Premium Animated Background Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Radial Gradients - Premium Glow */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-600/20 via-blue-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/3 w-1/2 h-1/2 bg-gradient-radial from-cyan-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl" />

        {/* Accent Glow Lines */}
        <div className="absolute top-0 left-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute bottom-1/3 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="backdrop-blur-md bg-slate-950/40 border-b border-slate-800/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="relative p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Car className="text-white" size={22} />
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent">ZUTA</span>
            </div>
            <div className="text-sm text-slate-400">Premium Dealer Network</div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="px-6 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                <Zap size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-200">Join 500+ Verified Dealers</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center space-y-6 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                <span className="block text-white mb-2">Unlock Your</span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">Premium Dealer Status</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Access our exclusive network of luxury vehicle buyers. Grow your business with verified buyer connections and premium exposure.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              {[
                { icon: Shield, label: "Verified Buyers", desc: "100% authenticated clients" },
                { icon: Clock, label: "Fast Approval", desc: "Usually within 48 hours" },
                { icon: Zap, label: "Instant Exposure", desc: "Premium marketplace access" }
              ].map((benefit, idx) => (
                <div key={idx} className="group relative p-4 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative">
                    <benefit.icon className="w-5 h-5 text-blue-400 mb-3" />
                    <h3 className="font-semibold text-white text-sm">{benefit.label}</h3>
                    <p className="text-xs text-slate-400 mt-1">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Form Container */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              {/* Decorative Border Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-slate-700/60 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl hover:border-slate-600/80 transition-all duration-300">
                {/* Section Header */}
                <div className="mb-8 pb-6 border-b border-slate-700/40">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Application Details</h2>
                  <p className="text-slate-400 text-sm">Complete your dealer verification in 5 minutes</p>
                </div>

                {/* Form Component */}
                <OnboardingForm
                  userId={userId}
                  userEmail={user?.emailAddresses[0].emailAddress || ""}
                />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-400">SSL Encrypted & Secure</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-400">GDPR & Privacy Compliant</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-400">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Legal Footer */}
            <p className="text-center text-slate-500 text-xs mt-10 px-6">
              By submitting, you agree to Zuta's <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Professional Seller Terms</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

    </main>
  )
}