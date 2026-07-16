import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma"; 
import SellHero from "@/components/sell/SellOptions/SellHero";
import SellBenefits from "@/components/sell/SellOptions/SellBenefits";
import SellSteps from "@/components/sell/SellOptions/SellSteps";
import SellForm from "@/components/sell/SellOptions/SellForm";
import AnimatedSection from "@/utilities/AnimatedSection";
import { ShieldAlert } from "lucide-react"; // Nice visual safeguard icon

export default function SellPage() {
  return (
    <main className="bg-black">
      <SellHero />
      <SellBenefits />
      <AnimatedSection id="how-it-works">
        <SellSteps />
      </AnimatedSection>
      <section id="sell-form">
        <SellFormContainer />
      </section>
    </main>
  );
}

export async function SellFormContainer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/?auth=login");
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { 
      onboardingComplete: true, 
      role: true, 
      name: true, 
      phone: true,
      privateListingLimit: true // Pull listing limit state
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  const isDealer = dbUser.role === "DEALER";
  const isPrivateUser = dbUser.role === "USER";

  // 1. Guardrail for Dealers: Must complete onboarding
  if (isDealer && !dbUser.onboardingComplete) {
    redirect("/onboarding");
  }

  // 2. Guardrail for Private Sellers: Must have available slots remaining
  const limit = dbUser.privateListingLimit ?? 0;
  if (isPrivateUser && limit <= 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">No Listing Slots Remaining</h2>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Private profiles are limited to 2 free listings. To list more vehicles, upgrade your profile or contact our support console.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SellForm
      defaultEmail={user.email || ""}
      defaultName={dbUser.name || (isDealer ? "Verified Dealer" : "Private Seller")}
      defaultPhone={dbUser.phone || ""}
      isPrivateUser={isPrivateUser}
      listingsRemaining={limit}
    />
  );
}