import { mockParts } from "@/data/parts";
import { Part } from "@/types/parts/part";

export async function getParts(filters?: Partial<Part>): Promise<Part[]> {
  let parts = mockParts;

  if (!filters) return parts;

  if (filters.brand) {
    parts = parts.filter(
      (p) => p.brand.toLowerCase() === filters.brand?.toLowerCase(),
    );
  }

  if (filters.category) {
    parts = parts.filter(
      (p) => p.category.toLowerCase() === filters.category?.toLowerCase(),
    );
  }

  if (filters.condition) {
    parts = parts.filter((p) => p.condition === filters.condition);
  }

  const price = filters.price;
  if (price !== undefined) {
    parts = parts.filter((p) => p.price <= price);
  }
  return parts;
}

export async function getPartBySlug(slug: string): Promise<Part | null> {
  const part = mockParts.find((p) => p.slug === slug);
  return part ?? null;
}
