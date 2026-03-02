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
  id: string;
  slug: string;
  vin?: string;

  brand: string;
  model: string;
  year: number;
  bodyType: BodyType;
  
  transmission: Transmission;
  fuelType: FuelType;
  drivetrain: Drivetrain;
  mileage: number; // in kilometers

    condition: CarCondition;
  accidentHistory: boolean;
  serviceHistory: boolean;
  
  price: number;
  currency: Currency;
  negotiable: boolean;
  
  thumbnail: string;
  images: string[];
  
  status: ListingStatus;
  featured: boolean;
  views: number;
  
  sellerId: string;
  
  createdAt: Date;
  updatedAt: Date;
};
export type CarFilters = {
  brand?: string;
  model?: string;

  year?: number;
  minPrice?: number;
  maxPrice?: number;

  bodyType?: BodyType;
  fuelType?: FuelType;
  transmission?: Transmission;
  condition?: CarCondition;

  minMileage?: number;
  maxMileage?: number;

  sortBy?: "price" | "year" | "mileage";
  order?: "asc" | "desc";

  page?: number;
  pageSize?: number;
  limit?: number;

  q?: string;
};

export type FilterFormProps<T extends object> = {
  filters: T;
  updateFilter: <K extends keyof T>(
    key: K,
    value: T[K]
  ) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  isPending: boolean;
  mobile?: boolean;
};

export type CarFilterFormState = {
  brand: string;
  model: string;
  year: string;
  minPrice: string;
  maxPrice: string;
};