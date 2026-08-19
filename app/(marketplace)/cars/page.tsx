import { getCars } from "@/lib/engine/marketplace";
import Link from "next/link";
import CarsHero from "@/components/ui/Home/CarsHero";
import CarCard from "@/components/ui/card/CarCard";
import CarsFilter from "@/components/ui/Filter/cars/CarsFilter";
import FilterSheet from "@/components/ui/Filter/FilterSheet";
import type { CarFilters } from "@/types/car/cars.types";
import Pagination from "@/components/ui/Pagination/CarPagination";
import { Sparkles, CarFront, RotateCcw } from "lucide-react";
import { BodyType, Transmission,FuelType } from "@/types/car/car.enums";

function getEnumValue<T extends string>(
  value: string | string[] | undefined
): T | undefined {
  return typeof value === "string" && value.trim() !== "" 
    ? (value as T) 
    : undefined;
}
export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const getString = (value: string | string[] | undefined) =>
    typeof value === "string" ? value : undefined;

  const getNumber = (value: string | string[] | undefined) =>
    typeof value === "string" ? Number(value) : undefined;

  // Search query priority: "q" or "search" or "searchTerm"
  const rawQuery =
    getString(params.q) ||
    getString(params.search) ||
    getString(params.searchTerm);

  const filters: CarFilters & Record<string, unknown> = {
    brand: getString(params.brand),
    model: getString(params.model),
    year: getNumber(params.year),
    minPrice: getNumber(params.minPrice),
    maxPrice: getNumber(params.maxPrice),
    page: getNumber(params.page) ?? 1,
    condition:
      typeof params.condition === "string"
        ? (params.condition as CarFilters["condition"])
        : undefined,
    bodyType: getEnumValue<BodyType>(params.bodyType),
  fuelType: getEnumValue<FuelType>(params.fuelType),
  transmission: getEnumValue<Transmission>(params.transmission),
    sortBy:
      typeof params.sort === "string"
        ? (params.sort as CarFilters["sortBy"])
        : undefined,
    q: rawQuery,
  };

  // Calculate active filter count (excluding pagination)
  const activeFilterCount = Object.entries(params).filter(
    ([key, val]) => key !== "page" && Boolean(val)
  ).length;

  const cars = await getCars({
    ...filters,
    pageSize: 12,
  });

  const hasResults = cars.data.length > 0;
  const serializedCars = JSON.parse(JSON.stringify(cars.data));

  // Dynamic heading generator
  const heading = hasResults
    ? filters.q
      ? `Search results for "${filters.q}"`
      : filters.brand
      ? `${filters.brand} Vehicles`
      : "Verified Showroom Vehicles"
    : filters.q
    ? `No matches for "${filters.q}"`
    : filters.brand
    ? `No ${filters.brand} vehicles available`
    : "No vehicles match your criteria";


  return (
    <div className="max-w-7xl relative mx-auto px-4 md:px-6 lg:px-8 py-6 text-white">
      {/* Hero Banner with Gemini AI Input */}
      <CarsHero totalCars={cars.total} />

      {/* Showroom Heading Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 my-6 pb-4 border-b border-neutral-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white italic">
            {heading}
          </h1>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Browse inspected, ready-to-drive vehicles across Nigeria
          </p>
        </div>

        {activeFilterCount > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>{activeFilterCount} Active Filters</span>
          </div>
        )}
      </div>

      <main className="flex-1 space-y-6">
        {/* Closeable Filter Accordion Sheet */}
        <FilterSheet
          totalResults={cars.total}
          defaultOpen={false}
          activeFilterCount={activeFilterCount}
        >
          <CarsFilter />
        </FilterSheet>

        {/* Vehicle Cards Grid */}
        {hasResults ? (
          <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-4 mt-4">
  <CarCard cars={serializedCars} />
</div>
            {/* Pagination Controls */}
            <div className="pt-6 border-t border-neutral-900">
              <Pagination
                totalPages={cars.totalPages}
                currentPage={cars.page}
              />
            </div>
          </div>
        ) : (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800/80 rounded-3xl bg-neutral-950/40 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center">
              <CarFront size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                No Vehicles Found
              </h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                {filters.q
                  ? `We couldn't find any vehicles matching "${filters.q}". Try adjusting your query or price parameters.`
                  : filters.brand
                  ? `There are currently no ${filters.brand} models matching your exact specs.`
                  : "No vehicles match the selected filter parameters."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}