import { mockCars } from "@/data/cars";
import { CarFilters } from "@/types/car/cars.types";
import { Car } from "@/types/car/cars.types";
import {cache} from 'react';
export async function getCars(filters?: Partial<CarFilters>) {
  let results = [...mockCars];

  if (filters) {
    // 🔍 Text search
    if (filters.q) {
      const search = filters.q.toLowerCase();

      results = results.filter((car) => {
        return (
          car.brand.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.bodyType?.toLowerCase().includes(search) ||
          car.year.toString().includes(search)
        );
      });
    }

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
    if (filters.minPrice)
      results = results.filter((car) => car.price >= filters.minPrice!);

    if (filters.maxPrice)
      results = results.filter((car) => car.price <= filters.maxPrice!);

    // Sorting
    if (filters.sortBy) {
      const direction = filters.order === "desc" ? -1 : 1;
      const field = filters.sortBy;

      results.sort((a, b) => {
        if (a[field] > b[field]) return direction;
        if (a[field] < b[field]) return -direction;
        return 0;
      });
    }
  }

  // Pagination
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);

  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return {
    data,
    total,
    totalPages,
    page,
  };
}


export const getCarBySlug = cache(async (slug:string):Promise<Car | null> => {
  const car = mockCars.find((car) => car.slug === slug);
  return car ?? null;
})