import { getParts } from "@/lib/engine/PartsEngine";
import PartCard from "@/components/ui/card/PartsCard";
import PartsFilter from "@/components/ui/Filter/PartsFilter";
import type { Part } from "@/types/parts/part";
import { Suspense } from "react";

type PartsPageProps = {
  searchParams?: {
    brand?: string;
    category?: string;
    condition?: string;
    maxPrice?: string;
  };
};

export default async function PartsPage({ searchParams }: PartsPageProps) {
  // Transform URL params → proper types
  const conditionParam = searchParams?.condition;
  const condition =
    conditionParam === "new" ||
    conditionParam === "used" ||
    conditionParam === "refurbished"
      ? conditionParam
      : undefined;

  const filters: Partial<Part> = {
    brand: searchParams?.brand,
    category: searchParams?.category,
    condition,
    price: searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined,
  };

  const parts = await getParts(filters);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Available Parts</h1>

      {/* Client Filter UI */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <PartsFilter />
      </Suspense>
      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
}
