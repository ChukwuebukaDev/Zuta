export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-gray-100 min-h-screen">{children}</section>;
}
