import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  // 1. Authenticate with Supabase SSR
  const supabase = await createClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authUser) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: authUser.id },
    select: { 
      role: true, 
      isVerified: true,
      onboardingComplete: true 
    }
  });

  if (!user) {
    redirect("/login");
  }

  // 3. 🛡️ CLEAN GATEKEEPER PIPELINE
  // Admins and regular users (Buyers/Private Sellers) are cleared instantly
  if (user.role === "ADMIN" || user.role === "USER") {
    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 selection:bg-blue-600/30 selection:text-white">
        {children}
      </div>
    );
  }

  // 4. Dealership Verification Lifecycle Enforcement
  if (user.role === "DEALER") {
    if (!user.isVerified) {
      if (user.onboardingComplete) {
        redirect("/onboarding/status");
      } else {
        redirect("/onboarding");
      }
    }
    

    return (
      <div className="min-h-screen bg-zinc-950 text-slate-100 selection:bg-emerald-600/30 selection:text-white">
        {children}
      </div>
    );
  }

  // 5. Emergency Catch-All Security Escape
  redirect("/cars");
}