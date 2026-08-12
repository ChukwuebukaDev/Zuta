import { prisma as db } from "@/lib/prisma";
import {
  FuelType,
  Transmission,
  Condition,
  Status,
  ListingStatus,
  Prisma,
} from "@prisma/client";

type InventoryFilters = {
  brand?: string | null;
  model?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  bodyType?: string | null;
  condition?: Condition | null;
  fuelType?: FuelType | null;
  transmission?: Transmission | null;
};

export async function findCars(filters: InventoryFilters) {
  const where: Prisma.CarWhereInput = {
    // Only show legitimate active listings
    status: Status.AVAILABLE,
    listingStatus: ListingStatus.APPROVED,

    ...(filters.brand
      ? {
          brand: {
            equals: filters.brand,
            mode: "insensitive",
          },
        }
      : {}),

    ...(filters.model
      ? {
          model: {
            equals: filters.model,
            mode: "insensitive",
          },
        }
      : {}),

    ...(filters.minPrice !== null &&
    filters.minPrice !== undefined
      ? {
          price: {
            gte: filters.minPrice,
          },
        }
      : {}),

    ...(filters.maxPrice !== null &&
    filters.maxPrice !== undefined
      ? {
          price: {
            lte: filters.maxPrice,
          },
        }
      : {}),

    ...(filters.bodyType
      ? {
          bodyType: {
            equals: filters.bodyType,
            mode: "insensitive",
          },
        }
      : {}),

    ...(filters.condition
      ? {
          condition: filters.condition,
        }
      : {}),

    ...(filters.fuelType
      ? {
          fuelType: filters.fuelType,
        }
      : {}),

    ...(filters.transmission
      ? {
          transmission: filters.transmission,
        }
      : {}),
  };

  return db.car.findMany({
    where,

    include: {
      knowledge: true,
      carImages: true,
    },

    take: 50,

    orderBy: {
      createdAt: "desc",
    },
  });
}