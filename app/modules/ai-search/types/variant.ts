import type { KnowledgeFact } from "./fact";
import type { EngineFacts } from "./engine";
import type { FuelEconomy } from "./fuel-economy";



export type FuelType =
  | "PETROL"
  | "DIESEL"
  | "ELECTRIC"
  | "HYBRID";

  export type TransmissionType =
  | "MANUAL"
  | "AUTOMATIC"
  | "CVT"
  | "DUAL_CLUTCH";

export type DrivetrainType =
  | "FWD"
  | "RWD"
  | "AWD"
  | "4WD";

export interface CarVariant {
  name?: string;

  yearFrom?: number;
  yearTo?: number;

  engine: EngineFacts;

  fuelType?: KnowledgeFact<FuelType>;
  transmission?: KnowledgeFact<TransmissionType>;
  drivetrain?: KnowledgeFact<DrivetrainType>;

  fuelEconomy?: FuelEconomy;
}