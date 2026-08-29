import {
  Transmission,
  FuelType,
  BodyType,
  Condition

} from "@prisma/client";

export type Car = {
  id: string;
  slug: string;
  vin?: string;
  trim?: string;
  engineSize?: string;
  doorOptions?: number | null;
 fuelCapacity?:number | null;
horsePower?:number | null;
  brand: string;
  model: string;
  color?: string;
  year: number;
  bodyType: string;

  transmission: string;
  fuelType: string;
  drivetrain: string;
  mileage: number; // in kilometers

  condition: string;
  accidentHistory: boolean;
  serviceHistory: boolean;
  sellerType: "PRIVATE" | "DEALER";
  price: number;
  currency: string;
  negotiable: boolean;

  thumbnail: string;
  images: string[]; 
  carImages: string[];

  userId: string;
  user?: {
    name: string | null;
    email: string | null;
    imageUrl?: string | null; // Clerk image URL
    isVerified?: boolean;
  };
  country:string;
  city:string;
  status: string;
  listingStatus: string;
  featured: boolean;
  views: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  expiresAt?: Date | null;
  soldAt?: Date | null;
  archivedAt?: Date | null;
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
  condition?: Condition;

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
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
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
  condition?: string;
};
