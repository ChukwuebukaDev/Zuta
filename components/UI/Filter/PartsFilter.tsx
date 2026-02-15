"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function PartsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openFilters, setOpenFilters] = useState(false);

  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(
    (searchParams.get("condition") as string) || "",
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (condition) params.set("condition", condition);
    if (maxPrice) params.set("maxPrice", maxPrice);

    startTransition(() => {
      router.push(`?${params.toString()}`);
      setOpenFilters(false);
    });
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push("?");
      setBrand("");
      setCategory("");
      setCondition("");
      setMaxPrice("");
      setOpenFilters(false);
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="bg-black text-white px-4 py-2 rounded-lg md:hidden"
        onClick={() => setOpenFilters(true)}
      >
        Filters
      </button>

      {/* Desktop Filters */}
      <div className="hidden md:block bg-white border rounded-xl p-6 shadow-sm mt-6">
        <FilterForm
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
          condition={condition}
          setCondition={setCondition}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          isPending={isPending}
        />
      </div>

      {/* Mobile Drawer */}
      {openFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:hidden">
          <div className="bg-white w-full rounded-t-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filter Parts</h2>
              <button onClick={() => setOpenFilters(false)}>✕</button>
            </div>

            <FilterForm
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              condition={condition}
              setCondition={setCondition}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              isPending={isPending}
              mobile
            />
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- Filter Form Component ---------------- */
function FilterForm({
  brand,
  setBrand,
  category,
  setCategory,
  condition,
  setCondition,
  maxPrice,
  setMaxPrice,
  applyFilters,
  resetFilters,
  isPending,
  mobile = false,
}: any) {
  return (
    <>
      <div
        className={`grid gap-4 ${
          mobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
        }`}
      >
        <Input placeholder="Brand" value={brand} onChange={setBrand} />
        <Input placeholder="Category" value={category} onChange={setCategory} />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
        <Input
          placeholder="Max Price"
          type="number"
          value={maxPrice}
          onChange={setMaxPrice}
        />
      </div>

      <div
        className={`flex gap-4 ${
          mobile ? "sticky bottom-0 bg-white pt-4" : "mt-4"
        }`}
      >
        <button
          onClick={applyFilters}
          className="bg-black text-white px-6 py-2 rounded-lg w-full"
          disabled={isPending}
        >
          Apply
        </button>

        <button
          onClick={resetFilters}
          className="border px-6 py-2 rounded-lg w-full"
          disabled={isPending}
        >
          Reset
        </button>
      </div>
    </>
  );
}

/* ---------------- Simple Input Component ---------------- */
function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
    />
  );
}
