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
};

export type MarketplaceState = {
  items: MarketplaceItem[];
};
