import { getCars } from "@/lib/engine/marketplace";
import Link from "next/link";
import CarCard from "@/components/ui/card/CarCard";
import CarsFilter from "@/components/ui/Filter/cars/CarsFilter";
import FilterSheet from "@/components/ui/Filter/FilterSheet";
import type { CarFilters } from "@/types/car/cars.types";
import Pagination from "@/components/ui/Pagination/CarPagination";

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

  const filters: CarFilters = {
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
    sortBy:
      typeof params.sort === "string"
        ? (params.sort as CarFilters["sortBy"])
        : undefined,
    q: getString(params.q),
  };

  const cars = await getCars({
    ...filters,
    pageSize: 20,
  });

  const hasResults = cars.data.length > 0;

  const heading = hasResults
    ? filters.q
      ? `Search results for "${filters.q}"`
      : filters.brand
        ? `${filters.brand} Cars`
        : "Cars In Nigeria"
    : filters.q
      ? `No results found for "${filters.q}"`
      : filters.brand
        ? `No ${filters.brand} cars available`
        : "No cars available";
        
  return (
    <div className="max-w-7xl relative mx-auto px-4 md:px-6 lg:px-8 py-4">
      <div className="">
        <h1 className="text-2xl text-center lg:text-3xl font-bold">{heading}</h1>
      </div>

      <main className="flex-1">
        {/* Wrap CarsFilter in the closeable sheet */}
       <FilterSheet totalResults={cars.total} defaultOpen={false}>
          <CarsFilter />
        </FilterSheet>
        
        {hasResults ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-2 mt-4">
              <CarCard cars={cars.data} />
            </div>

            <Pagination
              totalPages={cars.totalPages}
              currentPage={cars.page}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-semibold mb-3">No cars found</h2>

            <p className="text-gray-500 max-w-md">
              {filters.q
                ? `We couldn’t find any cars matching "${filters.q}".`
                : filters.brand
                  ? `There are currently no ${filters.brand} cars available.`
                  : "There are no cars available at the moment."}
            </p>

           {cars.total >= 1 && (
             <div className="mt-6">
              <Link
                href="/cars"
                className="inline-block bg-black text-white px-6 py-2 rounded-lg"
              >
                View All Cars
              </Link>
            </div>
           )}
          </div>
        )}
      </main>
    </div>
  );
}