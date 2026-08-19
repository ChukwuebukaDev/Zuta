import type { KnowledgeFact } from "./fact";

export type FuelEconomyUnit =
  | "L_PER_100KM"
  | "KM_PER_L"
  | "MPG";

export interface FuelEconomy {
  city?: KnowledgeFact<number>;
  highway?: KnowledgeFact<number>;
  combined?: KnowledgeFact<number>;

  unit: FuelEconomyUnit;

  testCycle?: string;
}