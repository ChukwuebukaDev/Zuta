import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma"; 
import SellHero from "@/components/sell/SellOptions/SellHero";
import SellBenefits from "@/components/sell/SellOptions/SellBenefits";
import SellSteps from "@/components/sell/SellOptions/SellSteps";
import SellForm from "@/components/sell/SellOptions/SellForm";
import AnimatedSection from "@/utilities/AnimatedSection";

export default function SellPage() {
  return (
    <main className="bg-black">
      <SellHero />
      <SellBenefits />
      <AnimatedSection id="how-it-works"><SellSteps /></AnimatedSection>
      <AnimatedSection id="sell-form"><SellFormContainer /></AnimatedSection>
    </main>
  );
}

async function SellFormContainer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?redirect_url=/sell");
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { onboardingComplete: true, role: true, name: true, phone: true },
  });

  if (!dbUser || dbUser.role !== "DEALER" || !dbUser.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <SellForm
      defaultEmail={user.email || ""}
      defaultName={dbUser.name || "Verified Dealer"}
      defaultPhone={dbUser.phone || ""}
    />
  );
}