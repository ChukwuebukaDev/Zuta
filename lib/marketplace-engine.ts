import { fetchMarketplaceItems } from "./marketData";

export async function getMarketplaceItems() {
  return await fetchMarketplaceItems();
}

export async function getItemsByCategory(category: string) {
  const items = await fetchMarketplaceItems();
  return items.filter((item) => item.category === category);
}

export async function getItemById(id: string) {
  const items = await fetchMarketplaceItems();
  return items.find((item) => item.id === id);
}
