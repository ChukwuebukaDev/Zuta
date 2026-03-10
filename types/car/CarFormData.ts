import {
  Transmission,
  FuelType,
  Drivetrain,
  BodyType,
  CarCondition,
  Currency,
} from "./car.enums";

export type CarFormData = {
  brand: string;
  model: string;
  year: string;
  mileage: number | ""; // allow empty input initially
  transmission: Transmission | "";
  fuelType: FuelType | "";
  drivetrain: Drivetrain | "";
  bodyType: BodyType | "";
  condition: CarCondition | "";
  price: number | "";
  currency: Currency;
  negotiable: boolean;
  mainImage: File | null;
  galleryImages: File[];
  sellerName: string;
  sellerPhone: string;
  location: string;
};
