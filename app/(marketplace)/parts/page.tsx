"use client";

import { useMarketplace } from "@/context/MarketplaceEngine";
import FilterEngine from "@/components/UI/Filter/FilterEngine";
import PartCard from "@/components/UI/Cards/PartsCard";

export default function PartsPage() {
  const { filteredItems, setFilters } = useMarketplace();

  // Only show parts
  const parts = filteredItems.filter((item) => item.category === "parts");

  // Filters specific to parts
  const partsFilters = [
    {
      type: "select",
      name: "brand",
      label: "Brand",
      options: [
        { label: "Toyota", value: "Toyota" },
        { label: "Honda", value: "Honda" },
        { label: "BMW", value: "BMW" },
        { label: "Mercedes", value: "Mercedes" },
        { label: "Ford", value: "Ford" },
      ],
    },
    {
      type: "select",
      name: "condition",
      label: "Condition",
      options: [
        { label: "New", value: "new" },
        { label: "Used", value: "used" },
      ],
    },
    {
      type: "text",
      name: "location",
      label: "Location",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex gap-8 p-6">
      {/* Filter Section */}
      <div className="w-64">
        <FilterEngine fields={partsFilters} onFilterChange={setFilters} />
      </div>

      {/* Parts Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.length === 0 ? (
          <p className="text-gray-500">No parts found.</p>
        ) : (
          parts.map((part) => <PartCard key={part.id} {...part} />)
        )}
      </div>
    </div>
  );
}
