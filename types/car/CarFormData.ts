import {
  Transmission,
  FuelType,
  Drivetrain,
  BodyType,
  Condition,
  
} from "@prisma/client";

export type CarFormData = {
  brand: string;
  model: string;
  color: string;
  year: number;
  transmission: Transmission;
  fuelType: FuelType;
  trim?: string;  
  engineSize?: string;
  description?: string;
  doorOptions?: number ;
  drivetrain?: Drivetrain;
  bodyType?: BodyType;
  condition?: Condition;
  engineCode?:string;
  accidentHistory?: boolean;
  serviceHistory?: boolean;

  mileage: number;
  price: number;
  currency?: 'NGN' | 'USD';
  negotiable: boolean;

  thumbnail: File | null;
  images: File[];



  country: string;
  state: string;
  city: string;
};
