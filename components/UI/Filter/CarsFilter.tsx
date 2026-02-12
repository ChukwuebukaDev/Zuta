"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (brand) params.set("brand", brand);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push("?");
    });
  };

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={applyFilters}
          className="bg-black text-white px-6 py-2 rounded-lg"
          disabled={isPending}
        >
          Apply
        </button>

        <button
          onClick={resetFilters}
          className="border px-6 py-2 rounded-lg"
          disabled={isPending}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
