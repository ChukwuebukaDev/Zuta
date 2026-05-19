"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useMemo } from "react";
import FilterForm from "../FilterForm";
import { CarFilterFormState } from "@/types/car/cars.types";

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Read directly from the URL during render (No useEffect needed!)
  const urlFilters = useMemo(() => ({
    brand: searchParams.get("brand") || "",
    model: searchParams.get("model") || "",
    year: searchParams.get("year") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    condition: searchParams.get("condition") || "",
  }), [searchParams]);

  // 2. Local state only tracks draft changes while typing/selecting
  const [filters, setFilters] = useState<CarFilterFormState>(urlFilters);

  // 3. Keep local draft state in sync if the URL changes externally (e.g., reset)
  // We can do this directly in render instead of an effect to avoid the cascade
  const [lastUrlFilters, setLastUrlFilters] = useState(urlFilters);
  if (urlFilters !== lastUrlFilters) {
    setFilters(urlFilters);
    setLastUrlFilters(urlFilters);
  }

  const persistSearch = (data: CarFilterFormState) => {
    localStorage.setItem(
      "zuta_last_search",
      JSON.stringify({ ...data, timestamp: Date.now() }),
    );
  };

  const updateFilter = <K extends keyof CarFilterFormState>(
    key: K,
    value: CarFilterFormState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      persistSearch(filters);
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.replace(`?`, { scroll: false });
    });
    setFilters({
      brand: "",
      model: "",
      year: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="mb-4 hidden md:block px-1">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">
          Find Your Next Ride
        </h2>
        <p className="text-xs text-slate-400">
          Filter through premium verified vehicles across Nigeria
        </p>
      </div>

      <div 
        className={`transition-all duration-300 ease-in-out ${
          isPending ? "opacity-60 pointer-events-none scale-[0.995]" : "opacity-100"
        }`}
      >
        <FilterForm
          filters={filters}
          updateFilter={updateFilter}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          isPending={isPending}
        />
      </div>
    </div>
  );
}