"use client";

import CarCondition from "./cars/CarCondition";
import BrandSelect from "@/components/ui/Filter/cars/BrandSelect";
import ModelSelect from "@/components/ui/Filter/cars/ModelSelect";
import Dropdown from "@/utilities/Dropdown"; 
import { FilterFormProps, CarFilterFormState } from "@/types/car/cars.types";

export default function FilterForm({
  filters,
  updateFilter,
  applyFilters,
  resetFilters,
  isPending,
  mobile = false,
}: FilterFormProps<CarFilterFormState>) {

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
    updateFilter("model", ""); 
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => 
    (currentYear - i).toString()
  );

  const priceOptions = [
    "1000000",
    "3000000",
    "5000000",
    "10000000",
    "20000000",
    "50000000",
    "100000000"
  ];

  return (
    <div className="w-full shadow-sm p-4 bg-zinc-950 rounded-2xl border border-slate-900">
      <div className={`flex ${mobile ? "flex-col" : "flex-row flex-wrap"} gap-3 items-center`}>
        
        {/* Brand Selector Component */}
        <BrandSelect value={filters.brand} onChange={handleBrandChange} />
        
        <ModelSelect
          brand={filters.brand}
          value={filters.model}
          onChange={(value) => updateFilter("model", value)}
        />

        {/* Custom Year Dropdown */}
        <div className="min-w-[130px] flex-1 w-full">
          <Dropdown
            placeholder="Year"
            value={filters.year}
            options={yearOptions}
            onChange={(value) => updateFilter("year", value)}
          />
        </div>

        {/* Custom Min Price Dropdown */}
        <div className="min-w-[140px] flex-1 w-full">
          <Dropdown
            placeholder="Min Price"
            value={filters.minPrice}
            options={priceOptions}
            onChange={(value) => updateFilter("minPrice", value)}
          />
        </div>

        {/* Custom Max Price Dropdown */}
        <div className="min-w-[140px] flex-1 w-full">
          <Dropdown
            placeholder="Max Price"
            value={filters.maxPrice}
            options={priceOptions}
            onChange={(value) => updateFilter("maxPrice", value)}
          />
        </div>

        {/* Vehicle Condition Selector */}
        <CarCondition
          value={filters.condition}
          onChange={(value) => updateFilter("condition", value)}
        />

        {/* Control Buttons */}
        <div className={`flex gap-2 items-center ${mobile ? "w-full mt-2" : "ml-auto"}`}>
          <button
            type="button"
            onClick={applyFilters}
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm h-12 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {isPending ? "Filtering..." : "Apply"}
          </button>

          <button
            type="button"
            onClick={resetFilters}
            disabled={isPending}
            className="bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 font-medium text-sm h-12 px-4 rounded-xl border border-slate-800 transition-all duration-200 disabled:opacity-50"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}