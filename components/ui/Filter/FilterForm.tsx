"use client";

import CarCondition from "./cars/CarCondition";
import BrandSelect from "@/components/ui/Filter/cars/BrandSelect";
import ModelSelect from "@/components/ui/Filter/cars/ModelSelect";
import Dropdown from "@/utilities/Dropdown";
import { FilterFormProps, CarFilterFormState } from "@/types/car/cars.types";
import { Loader2, RotateCcw, Filter } from "lucide-react";

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

  // Raw price values paired with scannable NGN labels
  const priceRawValues = [
    "1000000",
    "3000000",
    "5000000",
    "10000000",
    "20000000",
    "50000000",
    "100000000",
  ];

  // Helper to format large numbers to scannable currency strings
  const formatPriceLabel = (val: string) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 1000000000) return `₦${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(0)}M`;
    return `₦${num.toLocaleString()}`;
  };

  return (
    <div className="w-full p-4 sm:p-5 bg-neutral-950/80 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-md">
      <div
        className={`flex ${
          mobile ? "flex-col" : "flex-row flex-wrap"
        } gap-3 items-center`}
      >
        {/* Brand Selector */}
        <div className="min-w-[150px] flex-1 w-full">
          <BrandSelect value={filters.brand} onChange={handleBrandChange} />
        </div>

        {/* Model Selector */}
        <div className="min-w-[150px] flex-1 w-full">
          <ModelSelect
            brand={filters.brand}
            value={filters.model}
            onChange={(value) => updateFilter("model", value)}
          />
        </div>

        {/* Production Year Dropdown */}
        <div className="min-w-[120px] flex-1 w-full">
          <Dropdown
            placeholder="Year"
            value={filters.year}
            options={yearOptions}
            onChange={(value) => updateFilter("year", value)}
          />
        </div>

        {/* Min Price Dropdown */}
        <div className="min-w-[140px] flex-1 w-full">
          <Dropdown
            placeholder="Min Price"
            value={filters.minPrice}
            options={priceRawValues}
           
            onChange={(value) => updateFilter("minPrice", value)}
          />
        </div>

        {/* Max Price Dropdown */}
        <div className="min-w-[140px] flex-1 w-full">
          <Dropdown
            placeholder="Max Price"
            value={filters.maxPrice}
            options={priceRawValues}
           
            onChange={(value) => updateFilter("maxPrice", value)}
          />
        </div>

        {/* Condition Selector */}
        <div className="min-w-[140px] flex-1 w-full">
          <CarCondition
            value={filters.condition}
            onChange={(value) => updateFilter("condition", value)}
          />
        </div>

        {/* Action Controls */}
        <div
          className={`flex gap-2 items-center ${
            mobile ? "w-full mt-2" : "ml-auto"
          }`}
        >
          <button
            type="button"
            onClick={applyFilters}
            disabled={isPending}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-wider h-11 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin text-slate-950" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Filter size={14} />
                <span>Apply Specs</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetFilters}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-red-400 text-neutral-400 font-bold text-xs uppercase tracking-wider h-11 px-4 rounded-xl border border-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}