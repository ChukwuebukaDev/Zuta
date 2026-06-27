import { currentUser } from "@clerk/nextjs/server";
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

      <AnimatedSection id="how-it-works">
        <SellSteps />
      </AnimatedSection>

      <AnimatedSection id="sell-form">
        <SellFormContainer />
      </AnimatedSection>
    </main>
  );
}

async function SellFormContainer() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in?redirect_url=/sell");
  }

  // Grab both the onboarding completeness and the explicit schema role
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { 
      onboardingComplete: true,
      role: true 
    },
  });

  // Guardrail: Force user to onboarding if they aren't a dealer or haven't finished the wizard
  if (!dbUser || dbUser.role !== "DEALER" || !dbUser.onboardingComplete) {
    redirect("/onboarding");
  }

  const defaultEmail = user.emailAddresses[0]?.emailAddress || "";
  const defaultName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Verified Dealer";
  const defaultPhone = user.phoneNumbers[0]?.phoneNumber || "";

  return (
    <SellForm
      defaultEmail={defaultEmail}
      defaultName={defaultName}
      defaultPhone={defaultPhone}
    />
  );
}