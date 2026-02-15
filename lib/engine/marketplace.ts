import { mockCars } from "@/data/cars";
import { CarFilters } from "@/types/car/cars.types";
import { Car } from "@/types/car/cars.types";

export async function getCars(filters?: Partial<CarFilters>): Promise<Car[]> {
  let results = [...mockCars];

  if (!filters) return results;

  // Brand filter
  if (filters.brand) {
    results = results.filter((car) =>
      car.brand.toLowerCase().includes(filters.brand!.toLowerCase()),
    );
  }

  // Model filter
  if (filters.model) {
    results = results.filter((car) =>
      car.model.toLowerCase().includes(filters.model!.toLowerCase()),
    );
  }

  // Year filter
  if (filters.year) {
    results = results.filter((car) => car.year === filters.year);
  }

  // Price range
  if (filters.minPrice) {
    results = results.filter((car) => car.price >= filters.minPrice!);
  }

  if (filters.maxPrice) {
    results = results.filter((car) => car.price <= filters.maxPrice!);
  }

  // Sorting
  if (filters.sortBy) {
    const direction = filters.order === "desc" ? -1 : 1;

    results.sort((a, b) => {
      const field = filters.sortBy!;

      if (a[field] > b[field]) return direction;
      if (a[field] < b[field]) return -direction;
      return 0;
    });
  }

  return results;
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const car = mockCars.find((car) => car.slug === slug);
  return car ?? null;
}
