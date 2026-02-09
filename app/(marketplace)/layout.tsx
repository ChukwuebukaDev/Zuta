import { MarketplaceProvider } from "@/context/MarketplaceEngine";
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketplaceProvider>
      <section className="bg-gray-100 min-h-screen">{children}</section>
    </MarketplaceProvider>
  );
}
