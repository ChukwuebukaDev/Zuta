"use client";
import { useEffect, useState, Suspense } from "react";
import Input from "./InputForm";
import BrandSelect from "./cars/BrandSelect";
import { FilterFormProps,CarFilterFormState } from "@/types/car/cars.types";
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
    <>
      <div className={`grid gap-4 ${mobile ? "grid-cols-1" : "grid-cols-1 md:flex md:flex-col"}`}>
       
        <Suspense fallback={<div>Loading brands...</div>}>
          <BrandSelect value={filters.brand} onChange={handleBrandChange} />
        </Suspense>

     <select className="border-gray-400 border rounded-4xl p-1 w-full focus:outline-none outline-0"
  disabled={!filters.brand || loadingModels}
  value={filters.model}
  onChange={(e)=>updateFilter("model",e.target.value)}
>
  <option value="">All Models</option>

  {filters.brand &&
    models.map((m) => (
      <option key={m.Model_Name} value={m.Model_Name}>
        {m.Model_Name}
      </option>
    ))}
</select>
<select
  value={filters.condition}
onChange={(e) => updateFilter("condition", e.target.value)}
  className="border-gray-400 border rounded-4xl p-1 w-full focus:outline-none outline-0"
>
  <option value="">All Conditions</option>
  <option value="new">New</option>
  <option value="used">Used (All)</option>
  <option value="foreign-used">Foreign Used</option>
  <option value="nigeria-used">Nigeria Used</option>
</select>
        {/* Other Inputs */}
        <Input placeholder="Year" type="number" value={filters.year} onChange={(v) => updateFilter("year", v)} />
        <Input placeholder="Min Price" type="number" value={filters.minPrice} onChange={(v) => updateFilter("minPrice", v)} />
        <Input placeholder="Max Price" type="number" value={filters.maxPrice} onChange={(v) => updateFilter("maxPrice", v)} />
      </div>

      <div className={`flex gap-4 ${mobile ? "sticky bottom-0 bg-white pt-4" : "mt-4"}`}>
        <button onClick={applyFilters} className="bg-black text-white px-6 py-2 rounded-lg w-full" disabled={isPending}>
          Apply
        </button>
        <button onClick={resetFilters} className="bg-red-500 text-white font-bold rounded-lg w-full" disabled={isPending}>
          Reset
        </button>
      </div>
    </>
  );
}