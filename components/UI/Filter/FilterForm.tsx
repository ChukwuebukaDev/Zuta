"use client";
import { useEffect, useState } from "react";
import CarCondition from "./cars/CarCondition";
import BrandSelect from "./cars/BrandSelect";
import ModelSelect from "./cars/ModelSelect";
import { FilterFormProps, CarFilterFormState } from "@/types/car/cars.types";
export default function FilterForm({
  filters,
  updateFilter,
  applyFilters,
  resetFilters,
  isPending,
  mobile = false,
}: FilterFormProps<CarFilterFormState>) {
  const [models, setModels] = useState<{ Model_Name: string }[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!filters.brand) return;
    setLoadingModels(true);
    fetch(`/api/models/${filters.brand}`)
      .then((res) => res.json())
      .then(setModels)
      .finally(() => setLoadingModels(false));
  }, [filters.brand]);

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
    updateFilter("model", "");
  };

  return (
    <div className="w-full shadow-sm p-2">
      <div className="flex flex-wrap gap-3 items-center">
        
          <BrandSelect value={filters.brand} onChange={handleBrandChange} />
          <ModelSelect
            brand={filters.brand}
            value={filters.model}
            onChange={(value) => updateFilter("model", value)}
          />
          {/* Year */}
          <input
            type="number"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => updateFilter("year", e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm 
               focus:outline-none focus:ring-2 focus:ring-black/10 
               min-w-30"
          />

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min ₦"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm 
               focus:outline-none focus:ring-2 focus:ring-black/10 
               min-w-30"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max ₦"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm 
               focus:outline-none focus:ring-2 focus:ring-black/10 
               min-w-30"
          />

          <CarCondition
            value={filters.condition}
            onChange={(value) => updateFilter("condition", value)}
          />
          <button
            onClick={applyFilters}
            className="bg-black text-white px-5 py-2 rounded-xl"
            disabled={isPending}
          >
            Apply
          </button>

          <button
            onClick={resetFilters}
            className="bg-gray-100 px-5 py-2 rounded-xl"
            disabled={isPending}
          >
            Reset
          </button>
        </div>
    </div>
  );
}
