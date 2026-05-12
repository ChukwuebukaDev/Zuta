import { currentUser } from "@clerk/nextjs/server";
import SellHero from "@/components/sell/SellOptions/SellHero";
import SellBenefits from "@/components/sell/SellOptions/SellBenefits";
import SellSteps from "@/components/sell/SellOptions/SellSteps";
import SellForm from "@/components/sell/SellOptions/SellForm";
import AnimatedSection from "@/utilities/AnimatedSection";

export default function SellPage() {
  // Fetching the user server-side for security and SEO
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

// Separate component to handle the async user fetch cleanly
async function SellFormContainer() {
  const user = await currentUser();

  // Fallbacks ensure the backend never receives "undefined"
  const defaultEmail = user?.emailAddresses[0]?.emailAddress || "";
  const defaultName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Verified Dealer";
  const defaultPhone = user?.phoneNumbers[0]?.phoneNumber || "";

  return (
    <SellForm
      defaultEmail={defaultEmail}
      defaultName={defaultName}
      defaultPhone={user?.phoneNumbers[0]?.phoneNumber || ""}
    />
  );
}
