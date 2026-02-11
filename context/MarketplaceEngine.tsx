"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import {
  MarketplaceItem,
  MarketplaceContextType,
} from "@/types/Marketplace-types";

// --------------------
// Create Context// --------------------
const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

type ProviderProps = {
  initialItems: MarketplaceItem[];
  children: ReactNode;
};

export function MarketplaceProvider({ initialItems, children }: ProviderProps) {
  const [items, setItems] = useState<MarketplaceItem[]>(initialItems);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      for (const key in filters) {
        const value = filters[key];
        if (!value) continue; // skip empty filters

        // dynamic comparison (case-insensitive)
        if (
          item[key] === undefined ||
          item[key].toString().toLowerCase() !== value.toString().toLowerCase()
        ) {
          return false;
        }
      }
      return true;
    });
  }, [items, filters]);

  const addItem = (item: MarketplaceItem) => {
    setItems((prev) => [...prev, item]);
  };

  // --------------------
  // Remove Item
  // --------------------
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // --------------------
  // Get items by category
  // --------------------
  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category === category);
  };

  // --------------------
  // Provide context
  // --------------------
  return (
    <MarketplaceContext.Provider
      value={{
        items,
        filteredItems,
        filters,
        setFilters,
        addItem,
        removeItem,
        getItemsByCategory,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

// --------------------
// Custom Hook
// --------------------
export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context)
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return context;
}
