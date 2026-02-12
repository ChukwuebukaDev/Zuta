import { getCars } from "@/lib/engine/marketplace";
import CarCard from "@/components/UI/Cards/CarCard";
import CarsFilter from "@/components/UI/Filter/CarsFilter";
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
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Available Cars In Nigeria</h1>

      {/* Client filter UI */}
      <CarsFilter />

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CarCard cars={cars} />
      </div>
    </div>
  );
}
