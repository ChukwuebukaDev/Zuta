"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MarketplaceItem } from "@/types/Marketplace-types";

type MarketplaceContextType = {
  items: MarketplaceItem[];
  addItem: (item: MarketplaceItem) => void;
  removeItem: (id: string) => void;
  getItemsByCategory: (category: string) => MarketplaceItem[];
};

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

type ProviderProps = {
  initialItems: MarketplaceItem[];
  children: ReactNode;
};

export function MarketplaceProvider({ initialItems, children }: ProviderProps) {
  const [items, setItems] = useState<MarketplaceItem[]>(initialItems);

  const addItem = (item: MarketplaceItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category === category);
  };

  return (
    <MarketplaceContext.Provider
      value={{ items, addItem, removeItem, getItemsByCategory }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  }
  return context;
}
