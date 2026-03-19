import { prisma } from "@/lib/prisma";
import { CarFilters } from "@/types/car/cars.types";
import { Car } from "@/types/car/cars.types";
import { cache } from "react";
export async function getCars(filters?: Partial<CarFilters>) {
  const carsFromDb = await prisma.car.findMany({
    include: { carImages: true },
  });

  // Transform to match frontend Car type
  let results: Car[] = carsFromDb.map((car) => ({
    ...car,
    images: car.carImages.map((img) => img.url),
  }));

  if (filters) {
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

    if (filters.brand) {
      results = results.filter((car) =>
        car.brand.toLowerCase().includes(filters.brand!.toLowerCase()),
      );
    }

    if (filters.model) {
      results = results.filter((car) =>
        car.model.toLowerCase().includes(filters.model!.toLowerCase()),
      );
    }

    if (filters.year) {
      results = results.filter((car) => car.year === filters.year);
    }

    if (filters.condition === "used") {
      results = results.filter(
        (car) =>
          car.condition === "foreign-used" || car.condition === "nigeria-used",
      );
    } else if (filters.condition) {
      results = results.filter((car) => car.condition === filters.condition);
    }

    if (filters.minPrice)
      results = results.filter((car) => car.price >= filters.minPrice!);

    if (filters.maxPrice)
      results = results.filter((car) => car.price <= filters.maxPrice!);

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

export const getCarBySlug = cache(async (slug: string): Promise<Car | null> => {
  const car = await prisma.car.findUnique({
    where: { slug },
    include: { carImages: true }, // include images
  });

  if (!car) return null;

  // Map carImages -> images array to match UI shape
  return {
    ...car,
    images: car.carImages.map((img) => img.url),
  };
});
