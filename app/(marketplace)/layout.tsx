"use client";
import { useState, useEffect } from "react";
import { MarketplaceProvider } from "@/context/MarketplaceEngine";
import { MarketplaceItem } from "@/types/Marketplace-types";
import { fetchMarketplaceItems } from "@/lib/marketData";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialItems, setInitialItems] = useState<MarketplaceItem[]>(
    fetchMarketplaceItems(),
  );

  return (
    <MarketplaceProvider initialItems={initialItems}>
      <section className="bg-gray-100 min-h-screen">{children}</section>
    </MarketplaceProvider>
  );
}
