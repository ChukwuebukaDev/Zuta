import { z } from "zod";
import {
  Condition,
  FuelType,
  Transmission,
} from "@prisma/client";
export const SearchIntentSchema = z.object({
  brand: z.string().nullable().optional(),

  model: z.string().nullable().optional(),

  minPrice: z.number().nullable().optional(),

  maxPrice: z.number().nullable().optional(),

  bodyType: z.string().nullable().optional(),

condition: z
  .nativeEnum(Condition)
  .nullable()
  .optional(),

fuelType: z
  .nativeEnum(FuelType)
  .nullable()
  .optional(),

transmission: z
  .nativeEnum(Transmission)
  .nullable()
  .optional(),

  useCase: z
    .enum([
      "RIDESHARE",
      "FAMILY",
      "DAILY_COMMUTE",
      "LUXURY",
      "OFF_ROAD",
      "COMMERCIAL",
      "PERFORMANCE",
    ])
    .nullable()
    .optional(),

  priorities: z.array(
    z.enum([
      "fuelEfficiency",
      "reliability",
      "maintenanceCost",
      "resaleValue",
      "comfort",
      "performance",
      "safety",
      "cargoSpace",
      "rideQuality",
      "groundClearance",
      "partsAvailability",
    ])
  ).default([]),
});

export type SearchIntent = z.infer<typeof SearchIntentSchema>;
export type SearchPriority =
  SearchIntent["priorities"][number];