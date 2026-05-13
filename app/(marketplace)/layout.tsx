import MarketplaceHeader from "@/components/ui/Home/MarketplaceHeader";
import MarketplaceFooter from "@/components/ui/Home/MarketplaceFooter";
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketplaceHeader />
      <section className="bg-gray-100 min-h-screen">{children}</section>
      <MarketplaceFooter />
    </>
  );
}
