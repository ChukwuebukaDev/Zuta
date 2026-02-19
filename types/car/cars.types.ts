import {
  Transmission,
  FuelType,
  Drivetrain,
  BodyType,
  CarCondition,
  ListingStatus,
  Currency,
} from "./car.enums";

export type Car = {
  // Identity
  id: string;
  slug: string;
  vin?: string;

  // Core Details
  brand: string;
  model: string;
  year: number;
  bodyType: BodyType;

  // Specs
  transmission: Transmission;
  fuelType: FuelType;
  drivetrain: Drivetrain;
  mileage: number; // in kilometers

  // Condition
  condition: CarCondition;
  accidentHistory: boolean;
  serviceHistory: boolean;

  // Financial
  price: number;
  currency: Currency;
  negotiable: boolean;

  // Media
  thumbnail: string;
  images: string[];

  // Listing Metadata
  status: ListingStatus;
  featured: boolean;
  views: number;

  // Seller
  sellerId: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
};
export type CarFilters = {
  // Identity / Basic Search
  brand?: string;
  model?: string;
  year?: number;

  // Pricing
  minPrice?: number;
  maxPrice?: number;

  // Specs
  bodyType?: string; // sedan, suv, coupe
  fuelType?: string; // petrol, diesel, electric
  transmission?: string; // automatic, manual
  condition?: "new" | "used";

  // Mileage
  minMileage?: number;
  maxMileage?: number;

  // Sorting
  sortBy?: "price" | "year" | "mileage";
  order?: "asc" | "desc";

  // Pagination (future-ready)
  page?: number;
  pageSize?: number;
  limit?: number;

  q?: string; // G
};
