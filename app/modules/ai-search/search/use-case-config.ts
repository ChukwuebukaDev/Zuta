import type { SearchIntent } from "./schema";

type SearchPriority =
  SearchIntent["priorities"][number];

export type PriorityWeight = {
  priority: SearchPriority;
  weight: number;
};

export const USE_CASE_PRIORITIES: Record<
  NonNullable<SearchIntent["useCase"]>,
  PriorityWeight[]
> = {
  RIDESHARE: [
    { priority: "fuelEfficiency", weight: 0.35 },
    { priority: "reliability", weight: 0.25 },
    { priority: "maintenanceCost", weight: 0.20 },
    { priority: "partsAvailability", weight: 0.15 },
    { priority: "resaleValue", weight: 0.05 },
  ],

  FAMILY: [
    { priority: "safety", weight: 0.35 },
    { priority: "comfort", weight: 0.25 },
    { priority: "cargoSpace", weight: 0.20 },
    { priority: "reliability", weight: 0.20 },
  ],

  DAILY_COMMUTE: [
    { priority: "fuelEfficiency", weight: 0.35 },
    { priority: "reliability", weight: 0.30 },
    { priority: "maintenanceCost", weight: 0.20 },
    { priority: "comfort", weight: 0.15 },
  ],

  LUXURY: [
    { priority: "comfort", weight: 0.30 },
    { priority: "rideQuality", weight: 0.25 },
    { priority: "performance", weight: 0.25 },
    { priority: "safety", weight: 0.20 },
  ],

  OFF_ROAD: [
    { priority: "groundClearance", weight: 0.35 },
    { priority: "reliability", weight: 0.25 },
    { priority: "performance", weight: 0.20 },
    { priority: "safety", weight: 0.20 },
  ],

  COMMERCIAL: [
    { priority: "reliability", weight: 0.30 },
    { priority: "maintenanceCost", weight: 0.25 },
    { priority: "partsAvailability", weight: 0.20 },
    { priority: "cargoSpace", weight: 0.25 },
  ],

  PERFORMANCE: [
    { priority: "performance", weight: 0.40 },
    { priority: "rideQuality", weight: 0.25 },
    { priority: "safety", weight: 0.20 },
    { priority: "comfort", weight: 0.15 },
  ],
};