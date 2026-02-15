import { getCars } from "@/lib/engine/marketplace";
import CarCard from "@/components/UI/Cards/CarCard";
import CarsFilter from "@/components/UI/Filter/cars/CarsFilter";
import type { CarFilters } from "@/types/car/cars.types";

type CarsPageProps = {
  searchParams?: {
    brand?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  };
};

export default async function CarsPage({ searchParams }: CarsPageProps) {
  // Transform URL params → proper types
  const filters: Partial<CarFilters> = {
    brand: searchParams?.brand,
    model: searchParams?.model,
    year: searchParams?.year ? Number(searchParams.year) : undefined,
    minPrice: searchParams?.minPrice
      ? Number(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams?.maxPrice
      ? Number(searchParams.maxPrice)
      : undefined,
  };

  const cars = await getCars(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-2xl font-bold">Cars In Nigeria</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            <CarCard cars={cars} />
          </div>
        </main>
      </div>
    </div>
  );
}
