"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ValuationInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: "MANUAL" | "AUTOMATIC";
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  condition: "NEW" | "USED" | "CERTIFIED";
  state: string;
  city: string;
}

export async function calculateValuation(input: ValuationInput) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // 1. Basic Local Market Price Mapping (Estimating baseline brand values in NGN)
  const brandBaselines: Record<string, number> = {
    toyota: 12_000_000,
    lexus: 18_000_000,
    honda: 9_500_000,
    mercedes: 25_000_000,
    bmw: 20_000_000,
    hyundai: 8_000_000,
    kia: 7_500_000,
    ford: 11_000_000,
    default: 10_000_000,
  };

  const cleanBrand = input.brand.toLowerCase().trim();
  const baseline = brandBaselines[cleanBrand] || brandBaselines.default;

  // 2. Multiplicative Depreciation Calculations
  const age = Math.max(0, new Date().getFullYear() - input.year);
  const ageDepreciation = Math.pow(0.92, age); // 8% depreciation per year

  const mileageFactor = Math.max(0.6, 1 - (input.mileage / 400_000)); // Up to 40% mileage deduction

  let conditionMultiplier = 1.0;
  if (input.condition === "NEW") conditionMultiplier = 1.25;
  if (input.condition === "CERTIFIED") conditionMultiplier = 1.12;
  if (input.condition === "USED") conditionMultiplier = 0.85;

  // Calculate mid-estimate value
  const midValue = baseline * ageDepreciation * mileageFactor * conditionMultiplier;

  // Set ranges
  const estimatedMin = Math.round((midValue * 0.9) / 50_000) * 50_000;
  const estimatedMax = Math.round((midValue * 1.1) / 50_000) * 50_000;
  const confidence = age > 10 || input.mileage > 200_000 ? 75 : 92;

  try {
    // Save record to database using schema relational hooks
    const valuation = await db.carValuation.create({
      data: {
        brand: input.brand,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        transmission: input.transmission,
        fuelType: input.fuelType,
        condition: input.condition,
        state: input.state,
        city: input.city,
        estimatedMin,
        estimatedMax,
        confidence,
        userId: authUser?.id || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: valuation };
  } catch (error) {
    console.error("Valuation engine save error:", error);
    return { error: "Failed to process vehicle valuation." };
  }
}