import type { VehicleVariantReference } from "../knowledge/reference/vehicles/types";

export interface VehicleIdentity {
  brand: string;
  model: string;
  year: number;

  generation?: string;

  engineCode?: string;
  engineDisplacementLiters?: number;

  fuelType?: string;
  transmission?: string;
  drivetrain?: string;

  market?: string;

  reference: VehicleVariantReference;

  matchScore: number;

  confidence: number;

  isAmbiguous: boolean;
}