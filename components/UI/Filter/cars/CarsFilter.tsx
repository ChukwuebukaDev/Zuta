"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import FilterForm from "../FilterForm";
import { CarFilterFormState } from "@/types/car/cars.types";

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openFilters, setOpenFilters] = useState(false);


const [filters, setFilters] = useState<CarFilterFormState>(() => ({
  brand: searchParams.get("brand") || "",
  model: searchParams.get("model") || "",
  year: searchParams.get("year") || "",
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  condition: searchParams.get("condition") || "",
}));

  useEffect(() => {
    const hasActiveFilter = Object.values(filters).some(Boolean);
    if (hasActiveFilter) {
      localStorage.setItem(
        "zuta_last_search",
        JSON.stringify({ ...filters, timestamp: Date.now() })
      );
    }
  }, [filters]);

  // Update filter state
const updateFilter = <K extends keyof CarFilterFormState>(
  key: K,
  value: CarFilterFormState[K]
) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};


  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
Object.entries(filters).forEach(([key, value]) => {
  if (value) params.set(key, value.toString());
  else params.delete(key);
});
    params.delete("page"); // reset page

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      setOpenFilters(false);
    });
  };


  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["brand", "model", "year", "minPrice", "maxPrice"].forEach((key) =>
      params.delete(key)
    );
    params.delete("page");

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      setOpenFilters(false);
    });

    setFilters({
      brand: "",
      model: "",
      year: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="bg-black text-white px-4 py-2 rounded-lg md:hidden"
        onClick={() => setOpenFilters(true)}
      >
        Filters
      </button>

      {/* Desktop filters */}
      <div className="hidden md:block bg-white border rounded-xl p-6 shadow-sm mt-6">
        <FilterForm
          filters={filters}
          updateFilter={updateFilter}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          isPending={isPending}
        />
      </div>

      {/* Mobile drawer */}
      {openFilters && (
        <div
          onClick={() => setOpenFilters(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[95%] max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 space-y-6 animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                Filter Cars
              </h2>
              <button
                onClick={() => setOpenFilters(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-800"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="h-px bg-gray-100" />

          
            <div className="max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
              <FilterForm
                filters={filters}
                updateFilter={updateFilter}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
                isPending={isPending}
                mobile
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}