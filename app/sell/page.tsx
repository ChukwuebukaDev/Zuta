import SellHero from "@/components/sell/SellHero";
import SellBenefits from "@/components/sell/SellBenefits";
import SellSteps from "@/components/sell/SellSteps";
import SellForm from "@/components/sell/SellForm";
export default function SellPage() {
  return (
    <main>
      <SellHero />
      <SellBenefits/>
      <SellSteps/>
      <SellForm/>
    </main>
  );
}