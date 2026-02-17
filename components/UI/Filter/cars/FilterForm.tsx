import Input from "./InputForm";
export default function FilterForm({
  filters,
  updateFilter,
  applyFilters,
  resetFilters,
  isPending,
  mobile = false,
}: any) {
  return (
    <>
      <div
        className={`grid gap-4 ${mobile ? "grid-cols-1" : "grid-cols-1 md:flex md:flex-col"}`}
      >
        <Input
          placeholder="Brand"
          value={filters.brand}
          onChange={(v) => updateFilter("brand", v)}
        />
        <Input
          placeholder="Model"
          value={filters.model}
          onChange={(v) => updateFilter("model", v)}
        />
        <Input
          placeholder="Year"
          type="number"
          value={filters.year}
          onChange={(v) => updateFilter("year", v)}
        />
        <Input
          placeholder="Min Price"
          type="number"
          value={filters.minPrice}
          onChange={(v) => updateFilter("minPrice", v)}
        />
        <Input
          placeholder="Max Price"
          type="number"
          value={filters.maxPrice}
          onChange={(v) => updateFilter("maxPrice", v)}
        />
      </div>

      <div
        className={`flex gap-4 ${mobile ? "sticky bottom-0 bg-white pt-4" : "mt-4"}`}
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
          className="bg-red-500 text-white font-bold rounded-lg w-full"
          disabled={isPending}
        >
          Reset
        </button>
      </div>
    </>
  );
}
