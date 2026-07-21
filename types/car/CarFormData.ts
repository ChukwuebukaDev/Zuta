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
  color: string;
  year: number;
  transmission: Transmission;
  fuelType: FuelType;
  trim?: string;  
  engineSize?: string;
  doorOptions?: number ;
  drivetrain?: Drivetrain;
  bodyType?: BodyType;
  condition?: CarCondition;

  accidentHistory?: boolean;
  serviceHistory?: boolean;

  mileage: number;
  price: number;
  currency?: Currency;
  negotiable: boolean;

  thumbnail: File | null;
  images: File[];

  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;

  country: string;
  state: string;
  city: string;
};
