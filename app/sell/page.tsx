import SellHero from "@/components/sell/SellOptions/SellHero";
import SellBenefits from "@/components/sell/SellOptions/SellBenefits";
import SellSteps from "@/components/sell/SellOptions/SellSteps";
import SellForm from "@/components/sell/SellOptions/SellForm";
import AnimatedSection from "@/utilities/AnimatedSection";
export default function SellPage() {
  return (
    <main>
      <SellHero />
      <SellBenefits />
      <AnimatedSection id="how-it-works">
        <SellSteps />
      </AnimatedSection>
      <AnimatedSection id="sell-form">
        <SellForm />
      </AnimatedSection>
    </main>
  );
}
