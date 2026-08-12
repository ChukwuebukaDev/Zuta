import { z } from "zod";

export const CarKnowledgeAttributesSchema = z.object({
  scores: z.object({
    reliability:z.number().min(0).max(100),
    fuelEfficiency: z.number().min(0).max(100),
    maintenanceCost: z.number().min(0).max(100),
    resaleValue: z.number().min(0).max(100),
    comfort: z.number().min(0).max(100),
    performance: z.number().min(0).max(100),
    cargoSpace: z.number().min(0).max(100),
    safety: z.number().min(0).max(100),
    rideQuality: z.number().min(0).max(100),
    groundClearance: z.number().min(0).max(100),
    partsAvailability: z.number().min(0).max(100),
  }),

  idealFor: z.array(z.string()).optional(),

  pros: z.array(z.string()).optional(),

  cons: z.array(z.string()).optional(),

  commonIssues: z.array(z.string()).optional(),

  notes: z.string().optional(),
});

export type CarKnowledgeAttributes = z.infer<
  typeof CarKnowledgeAttributesSchema
>;