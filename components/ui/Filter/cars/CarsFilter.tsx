"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useMemo } from "react";
import FilterForm from "../FilterForm";
import { CarFilterFormState } from "@/types/car/cars.types";
import { Sparkles, Loader2 } from "lucide-react";

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Parse current active filters directly from URL SearchParams
  const urlFilters = useMemo(
    () => ({
      brand: searchParams.get("brand") || "",
      model: searchParams.get("model") || "",
      year: searchParams.get("year") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      condition: searchParams.get("condition") || "",
      bodyType: searchParams.get("bodyType") || "",
      transmission: searchParams.get("transmission") || "",
    }),
    [searchParams]
  );

  // 2. Draft filter state for form inputs
  const [filters, setFilters] = useState<CarFilterFormState>(urlFilters);

  // Sync draft state with URL changes when searchParams mutate externally
  const [prevUrlFilters, setPrevUrlFilters] = useState(urlFilters);
  if (prevUrlFilters !== urlFilters) {
    setFilters(urlFilters);
    setPrevUrlFilters(urlFilters);
  }

  // Calculate active filter count (ignoring empty strings)
  const activeFilterCount = useMemo(() => {
    return Object.values(urlFilters).filter(Boolean).length;
  }, [urlFilters]);

  const persistSearch = (data: CarFilterFormState) => {
    try {
      localStorage.setItem(
        "zuta_last_search",
        JSON.stringify({ ...data, timestamp: Date.now() })
      );
    } catch {
      // LocalStorage access fallback safety
    }
  };

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
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      }
    });

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      persistSearch(filters);
    });
  };

  const resetFilters = () => {
    const emptyState: CarFilterFormState = {
      brand: "",
      model: "",
      year: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
    };

    setFilters(emptyState);

    startTransition(() => {
      router.replace(`?`, { scroll: false });
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* Header Bar */}
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white italic">
              Filter <span className="text-amber-500">Showroom</span> Specs
            </h2>
            {isPending && (
              <Loader2 size={16} className="animate-spin text-amber-400" />
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">
            Refine verified vehicle specs across Nigeria's marketplace
          </p>
        </div>

        {activeFilterCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={12} />
            <span>{activeFilterCount} Active Filters</span>
          </div>
        )}
      </div>

      {/* Filter Form Card Wrapper */}
      <div
        className={`bg-neutral-950/80 border border-neutral-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out ${
          isPending
            ? "opacity-60 pointer-events-none scale-[0.998]"
            : "opacity-100"
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