import { MarketplaceItem } from "@/types/Marketplace-types";

export function fetchMarketplaceItems(): MarketplaceItem[] {
  // await new Promise((res) => setTimeout(res, 2200));

  return [
    {
      id: "1",
      name: "Toyota Corolla",
      price: "2500000",
      category: "cars",
      year: "2020",
      condition: "used",
      transmission: "automatic",
    },
    {
      id: "2",
      name: "Honda Civic",
      price: "3000000",
      category: "cars",
      year: "2022",
      condition: "new",
      transmission: "manual",
    },
  ];
}
