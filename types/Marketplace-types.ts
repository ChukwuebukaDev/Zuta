export type MarketplaceItem = {
  id: string;
  name: string;
  price: string;
  category: "cars" | "parts" | "accessories" | string;
  image?: string;
  description?: string;
  location?: string;
  year?: string;
  condition?: string;

  [key: string]: any;
};

export interface MarketplaceState {
  items: MarketplaceItem[];
  filteredItems: MarketplaceItem[];
  filters: Record<string, string>;
}

export type MarketplaceContextType = {
  items: MarketplaceItem[];
  filteredItems: MarketplaceItem[];
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;

  addItem: (item: MarketplaceItem) => void;
  removeItem: (id: string) => void;
  getItemsByCategory: (category: string) => MarketplaceItem[];
  getItemsById: (id: string) => MarketplaceItem | undefined;
};
