import type { VehicleIdentityInput } from "@/app/modules/ai-search/intelligence/identity/resolve-vehicle";
import type { VehicleVariantReference } from "./types";


export const MAX_VEHICLE_MATCH_SCORE = 135;
export function calculateAvailableMatchWeight(
  input: VehicleIdentityInput
): number {
  let weight = 0;

  if (input.engineCode) {
    weight += 35;
  }

  if (input.engineSize) {
    weight += 30;
  }

  if (input.fuelType) {
    weight += 20;
  }

  if (input.transmission) {
    weight += 20;
  }

  if (input.drivetrain) {
    weight += 15;
  }

  if (input.country) {
    weight += 15;
  }

  return weight;
}
export function scoreVehicleCandidate(
  input: VehicleIdentityInput,
  candidate: VehicleVariantReference
): number {
  let score = 0;

  // Engine displacement: 30 points
  if (
    input.engineSize &&
    candidate.engineDisplacementLiters
  ) {
    const inputEngine = parseEngineSize(
      input.engineSize
    );

    if (
      inputEngine !== undefined &&
      candidate.engineDisplacementLiters !== undefined
    ) {
      const difference = Math.abs(
        inputEngine -
          candidate.engineDisplacementLiters
      );

      if (difference <= 0.01) {
        score += 30;
      }
    }
  }

  if (
  input.engineCode &&
  candidate.engineCode &&
  input.engineCode.toLowerCase() ===
    candidate.engineCode.toLowerCase()
) {
  score += 35;
}

  // Fuel type: 20 points
  if (
    input.fuelType &&
    candidate.fuelType &&
    input.fuelType.toLowerCase() ===
      candidate.fuelType.toLowerCase()
  ) {
    score += 20;
  }

  // Transmission: 20 points
  if (
    input.transmission &&
    candidate.transmission &&
    input.transmission.toLowerCase() ===
      candidate.transmission.toLowerCase()
  ) {
    score += 20;
  }

  // Drivetrain: 15 points
  if (
    input.drivetrain &&
    candidate.drivetrain &&
    input.drivetrain.toLowerCase() ===
      candidate.drivetrain.toLowerCase()
  ) {
    score += 15;
  }

  // Market: 15 points
  if (
    input.country &&
    candidate.market &&
    input.country.toLowerCase() ===
      candidate.market.toLowerCase()
  ) {
    score += 15;
  }

  return score;
}

function parseEngineSize(
  engineSize: string
): number | undefined {
  const normalized = engineSize
    .trim()
    .toLowerCase();

  const ccMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*cc/
  );

  if (ccMatch) {
    const cc = Number(ccMatch[1]);

    if (!Number.isFinite(cc)) {
      return undefined;
    }

    return cc / 1000;
  }

  const literMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*l?/
  );

  if (!literMatch) {
    return undefined;
  }

  const liters = Number(literMatch[1]);

  return Number.isFinite(liters)
    ? liters
    : undefined;
}