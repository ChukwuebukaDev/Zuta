import { FuelType, Transmission } from "@prisma/client";
import {KnowledgeEvidence} from "../../../types/evidence"; 

export interface FuelEconomyReference {
  brand: string;
  model: string;
  generation?: string;
  engineCode?: string;
  engineDisplacementLiters: number;

  fuelType: FuelType;
  transmission: Transmission;

  market?: string;
  drivetrain?: string;
    
  combined: number;

  evidence: KnowledgeEvidence<number>[];

  unit: "L_PER_100KM";

  confidence: number;  //0 - 1

  verifiedAt:string;
}