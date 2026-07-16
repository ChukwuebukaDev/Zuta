import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  // 1. Initialize Supabase and read the current session
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect("/login");
  }

  // 2. Query the exact current status directly from your database
  const user = await db.user.findUnique({
    where: { id: authUser.id },
    select: { 
      role: true, 
      isVerified: true,
      onboardingComplete: true 
    }
  });

  // Handle completely missing accounts safely
  if (!user) {
    redirect("/login");
  }

  // 3. Buyer & Admin Gatekeep Override
  if (user.role === "USER" || user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        {children}
      </div>
    );
  }

  // 4. Enforce Dealership Onboarding state verification checks for Sellers/Dealers
  if (user.role === "DEALER") {
    if (!user.isVerified) {
      if (user.onboardingComplete) {
        redirect("/onboarding/status");
      } else {
        redirect("/onboarding");
      }
    }
  } else {
    // Fallback security loop if user has an unexpected role configuration
    redirect("/cars");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {children}
    </div>
  );
}