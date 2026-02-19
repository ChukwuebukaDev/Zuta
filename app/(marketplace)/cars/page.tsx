import { getCars } from "@/lib/engine/marketplace";
import CarCard from "@/components/UI/Cards/CarCard";
import CarsFilter from "@/components/UI/Filter/cars/CarsFilter";
import type { CarFilters } from "@/types/car/cars.types";
import Pagination from "@/components/UI/Pagination/CarPagination";

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const filters: CarFilters = {
    brand: params.brand as string | undefined,
    model: params.model as string | undefined,
    year: params.year ? Number(params.year) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    page: params.page ? Number(params.page) : 1,
    sortBy: params.sort as CarFilters["sortBy"],
    q: params.q as string | undefined, // 🔥 ADD THIS
  };

  const cars = await getCars({
    ...filters,
    pageSize: 5,
  });
  const heading = filters.q
    ? `Search results for "${filters.q}"`
    : filters.brand
      ? `${filters.brand} Cars`
      : "Cars In Nigeria";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-3xl font-bold">{heading}</h1>

        <CarsFilter />
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Filters</h2>
            <CarsFilter />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold">Cars In Nigeria</h1>
          </div>

          {/* Cars Grid */}
          <div
            className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  2xl:grid-cols-5
  gap-6 
  lg:gap-8
"
          >
            <CarCard cars={cars.data} />
          </div>
          <Pagination totalPages={cars.totalPages} currentPage={cars.page} />
        </main>
      </div>
    </div>
  );
}
