import type { EngineFacts } from "../types/engine"
import {
  FuelType,
  Transmission,
} from "@prisma/client";

export interface EngineEfficiencyInput {
  engine: EngineFacts;

  fuelType: FuelType;

  transmission?: Transmission;

  vehicleWeightKg?: number;

  bodyType?: string;
}

export interface EngineEfficiencyResult {
  score: number;  //0 - 100
  confidence: number;  //0 - 1

  method:
    | "VERIFIED"
    | "ESTIMATED";

  explanation: string;
}