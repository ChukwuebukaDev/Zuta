import PersonalizedSection from "../(home)/PersonalizedSection";
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PersonalizedSection />
      <section className="bg-gray-100 min-h-screen">{children}</section>
    </>
  );
}
