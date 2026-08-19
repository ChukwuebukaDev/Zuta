export interface VehicleVariantReference {
  brand: string;
  model: string;

  generation: string;

  yearFrom: number;
  yearTo: number;

  engineCode?: string;

  engineDisplacementLiters?: number;

  fuelType?: string;
  transmission?: string;
  drivetrain?: string;

  market?: string;
}