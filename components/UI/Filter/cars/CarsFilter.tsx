"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import FilterForm from "../FilterForm";
import { CarFilterFormState } from "@/types/car/cars.types";

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<CarFilterFormState>({
    brand: "",
    model: "",
    year: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
  });

  // ✅ Sync FROM URL → state (important)
  useEffect(() => {
    setFilters({
      brand: searchParams.get("brand") || "",
      model: searchParams.get("model") || "",
      year: searchParams.get("year") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      condition: searchParams.get("condition") || "",
    });
  }, [searchParams]);

  // ✅ Save ONLY when applying filters (not every keystroke)
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
    <div className="mt-4">
      <FilterForm
        filters={filters}
        updateFilter={updateFilter}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        isPending={isPending}
      />
    </div>
  );
}
