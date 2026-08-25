import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { 
  Car, Shield, Clock, Zap, Sparkles,
  BadgeCheck,CheckCircle2,
  Building2, Globe, Mail, Phone, Star, Crown
} from "lucide-react";

export default async function OnboardingPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Next.js handles server mutations safely downstream via Middleware layout checks
          }
        },
      },
    }
  );

  const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !supabaseUser) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: { id: supabaseUser.id },
    select: { 
      role: true,
      onboardingComplete: true, 
      isVerified: true 
    }
  });

  if (dbUser?.role === 'ADMIN') {
    redirect('/admin-dashboard');
  }

  if (dbUser?.isVerified && dbUser?.role === "DEALER") {
    redirect("/dashboard");
  }

  if (dbUser?.onboardingComplete && !dbUser?.isVerified) {
    redirect("/onboarding/status");
  }

  const userPayload = {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    avatarUrl: supabaseUser.user_metadata?.avatar_url || "",
    phone: supabaseUser.user_metadata?.phone || supabaseUser.phone || ""
  };


  const benefitCards = [
    { 
      icon: Shield, 
      label: "Commercial Verification", 
      desc: "Access high-intent buyer networks",
      iconClass: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    { 
      icon: Clock, 
      label: "48h Desk SLA", 
      desc: "Fast-track pipeline validation",
      iconClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    { 
      icon: Zap, 
      label: "Corporate Dashboard", 
      desc: "Real-time client leads access",
      iconClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    { 
      icon: Crown, 
      label: "Premium Listings", 
      desc: "Unlock luxury vehicle inventory",
      iconClass: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden relative">
      
      {/* ==================== BACKGROUND EFFECTS ==================== */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] md:opacity-[0.05]" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.15) 25%, rgba(59, 130, 246, 0.15) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.15) 75%, rgba(59, 130, 246, 0.15) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.15) 25%, rgba(59, 130, 246, 0.15) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.15) 75%, rgba(59, 130, 246, 0.15) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="absolute top-1/4 -left-1/4 w-[50%] md:w-1/3 h-[50%] bg-blue-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50%] md:w-1/3 h-[50%] bg-cyan-500/15 rounded-full blur-[150px]" />
      </div>

      {/* ==================== NAVIGATION ==================== */}
      <nav className="relative z-50 backdrop-blur-xl bg-slate-950/60 border-b border-slate-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative p-1.5 sm:p-2.5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
                <Car className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent tracking-tight">
                  ZUTA
                </span>
                <span className="hidden sm:inline text-[10px] font-bold text-blue-400/60 ml-1.5 uppercase tracking-widest">
                  • Dealership
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <BadgeCheck size={12} className="text-blue-400" />
                <span className="text-[10px] font-medium text-blue-300 tracking-wide">Verified Portal</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* ===== HERO SECTION ===== */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-[10px] sm:text-xs font-bold text-blue-200 tracking-[0.15em] uppercase">
                  Exclusive Dealer Network • Apply Now
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
                Register Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent block sm:inline">
                  Dealership Profile
                </span>
              </h1>
            </div>

            {/* ===== BENEFITS GRID ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {benefitCards.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-xl"
                >
                  {/* Fixed: Applied static class bindings to ensure icon wraps pop cleanly */}
                  <div className={`p-2 rounded-xl inline-flex items-center justify-center border mb-3 group-hover:scale-105 transition-transform duration-300 ${benefit.iconClass}`}>
                    <benefit.icon size={18} />
                  </div>
                  <h3 className="font-bold text-white text-xs sm:text-sm mb-1 uppercase tracking-wide">{benefit.label}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>

            {/* ===== FORM SECTION ===== */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 rounded-[2rem] blur-2xl pointer-events-none" />
              
              <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/50 rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-xl shadow-2xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-800/60">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 uppercase italic tracking-tight">
                      <Building2 size={22} className="text-blue-400" />
                      Dealership Credentials
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Please provide accurate corporate profiles matching your official registration parameters.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0 self-start sm:self-center">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">4-step verification</span>
                  </div>
                </div>

                <OnboardingForm
                  userId={userPayload.id}
                  userEmail={userPayload.email}
                  avatarUrl={userPayload.avatarUrl}
                  phone={userPayload.phone}
                />

                <div className="mt-8 pt-6 border-t border-slate-800/60">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-400" /> Secure Matrix</span>
                      <span className="text-slate-800">|</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-400" /> GDPR Protected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trusted by 2,400+ dealers</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ===== BOTTOM TRUST BAR ===== */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2"><Globe size={14} className="text-slate-600" /> <span>Global Network</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-600" /> <span>24/7 Support</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-600" /> <span>Dedicated Manager</span></div>
              <div className="flex items-center gap-2"><Star size={14} className="text-amber-500 fill-amber-500/10" /> <span>4.9/5 Rating</span></div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}