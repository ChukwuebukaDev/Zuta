import { prisma } from "@/lib/prisma";
import { CarFilters, Car } from "@/types/car/cars.types";
import { cache } from "react";
import { Prisma, Car as PrismaCar, CarImage as PrismaCarImage } from "@prisma/client";

type FullPrismaCar = PrismaCar & {
  carImages: PrismaCarImage[];
};

export async function getCars(filters?: Partial<CarFilters>) {
  // Setup pagination variables
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 20;
  const skip = (page - 1) * pageSize;


  const where: Prisma.CarWhereInput = {
    listingStatus: "APPROVED",
  };

  if (filters) {
    // Handle broad search query across multiple text fields
    if (filters.q) {
      where.OR = [
        { brand: { contains: filters.q, mode: 'insensitive' } },
        { model: { contains: filters.q, mode: 'insensitive' } },
        { bodyType: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    // Direct brand/model filtering
    if (filters.brand) where.brand = { contains: filters.brand, mode: 'insensitive' };
    if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' };
    if (filters.year) where.year = filters.year;

    // Numerical price range filtering
    if (filters.minPrice || filters.maxPrice) {
      where.price = {
        ...(filters.minPrice && { gte: filters.minPrice }),
        ...(filters.maxPrice && { lte: filters.maxPrice }),
      };
    }

    // Map "used" filter to the specific marketplace Enums
    // if (filters.condition === "used") {
    //   where.condition = { in: ["foreign-used", "nigeria-used"] };
    // } else if (filters.condition) {
    //   where.condition = filters.condition;
    // }
  }

  try {
    /**
     *
     * Fetching data and counting totals simultaneously to reduce latency.
     */
    const [carsFromDb, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { carImages: true },
        // Sort at DB level (SQL) rather than in JS memory
        orderBy: filters?.sortBy 
          ? { [filters.sortBy]: filters.order ?? 'desc' }
          : { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.car.count({ where }),
    ]);

    const data: Car[] = (carsFromDb as FullPrismaCar[]).map((car: FullPrismaCar) => ({
      ...car,
      // Fixed: 'img' is explicitly typed to avoid the 'any' error
      images: car.carImages.map((img: PrismaCarImage) => img.url),
    })) as unknown as Car[];

    return {
      data,
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
    };
  } catch (error) {
    console.error("ZUTA_DATA_FETCH_ERROR:", error);
    return { data: [], total: 0, totalPages: 0, page: 1 };
  }
}

/**
 * Optimized fetch for individual car details.
 * Uses React 'cache' to prevent redundant DB hits during a single request cycle.
 */
export const getCarBySlug = cache(async (slug: string): Promise<Car | null> => {
  const car = await prisma.car.findUnique({
    where: { slug },
    include: { carImages: true },
  });

  if (!car) return null;

  const typedCar = car as FullPrismaCar;

  return {
    ...typedCar,
    images: typedCar.carImages.map((img: PrismaCarImage) => img.url),
  } as unknown as Car;
});