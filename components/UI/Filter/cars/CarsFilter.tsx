"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import FilterForm from "../FilterForm";
export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openFilters, setOpenFilters] = useState(false);

  // Single filters object
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    minPrice: "",
    maxPrice: "",
  });

  // Sync filters with URL
  useEffect(() => {
    const urlFilters = {
      brand: searchParams.get("brand") || "",
      model: searchParams.get("model") || "",
      year: searchParams.get("year") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    };

    setFilters(urlFilters);

    const hasActiveFilter = Object.values(urlFilters).some(Boolean);

    if (hasActiveFilter) {
      localStorage.setItem(
        "zuta_last_search",
        JSON.stringify({
          ...urlFilters,
          timestamp: Date.now(),
        }),
      );
    }
  }, [searchParams]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page when filters change
    params.delete("page");

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      setOpenFilters(false);
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    ["brand", "model", "year", "minPrice", "maxPrice"].forEach((key) =>
      params.delete(key),
    );

    params.delete("page");

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      setOpenFilters(false);
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
          {/* Modal Card */}
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

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Scrollable Content */}
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
