import { MarketplaceItem } from "@/types/Marketplace-types";

export async function fetchMarketplaceItems(): Promise<MarketplaceItem[]> {
  await new Promise((res) => setTimeout(res, 2200));

  return [
    {
      id: "1",
      name: "Toyota Camry 2020",
      price: "₦12,500,000",
      category: "cars",
    },
    {
      id: "2",
      name: "Honda Accord 2019",
      price: "₦10,800,000",
      category: "cars",
    },
    {
      id: "3",
      name: "Brake Pads Set",
      price: "₦45,000",
      category: "parts",
    },
  ];
}
