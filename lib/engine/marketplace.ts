import { Car } from "@/types/car/cars.types";
import { CarFilters } from "@/types/car/cars.types";
const mockCars: Car[] = [
  {
    id: "1",
    slug: "2022-mercedes-c300",
    brand: "Mercedes-Benz",
    model: "C300",
    year: 2022,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "petrol",
    drivetrain: "rwd",
    mileage: 12000,

    condition: "foreign-used",
    accidentHistory: false,
    serviceHistory: true,

    price: 32000000,
    currency: "NGN",
    negotiable: true,

    thumbnail: "/cars/benz-thumb.jpg",
    images: ["/cars/benz-1.jpg", "/cars/benz-2.jpg", "/cars/benz-3.jpg"],

    status: "available",
    featured: true,
    views: 124,

    sellerId: "seller_001",

    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "2",
    slug: "2021-toyota-camry",
    brand: "Toyota",
    model: "Camry",
    year: 2021,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "petrol",
    drivetrain: "fwd",
    mileage: 25000,

    condition: "nigeria-used",
    accidentHistory: false,
    serviceHistory: true,

    price: 18000000,
    currency: "NGN",
    negotiable: false,

    thumbnail: "/cars/camry-thumb.jpg",
    images: ["/cars/camry-1.jpg", "/cars/camry-2.jpg"],

    status: "available",
    featured: false,
    views: 89,

    sellerId: "seller_002",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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

export async function getCarById(id: string): Promise<Car | null> {
  const car = mockCars.find((car) => car.id === id);
  return car ?? null;
}
