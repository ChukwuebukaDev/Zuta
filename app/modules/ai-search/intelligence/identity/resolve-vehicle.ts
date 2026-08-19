export interface VehicleIdentityInput {
  brand: string;
  model: string;
  year: number;

  engineSize?: string | null;
 engineCode?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;

  country?: string | null;
}

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

  market?: string | null;

  confidence: number;
}

export function resolveVehicleIdentity(
  input: VehicleIdentityInput
): VehicleIdentity {
  const brand = input.brand.trim().toUpperCase();
  const model = input.model.trim();

  const engineDisplacementLiters = input.engineSize
    ? parseEngineSize(input.engineSize)
    : undefined;

  return {
    brand,
    model,
    year: input.year,

    engineDisplacementLiters,

    fuelType: input.fuelType?.toUpperCase(),
    transmission: input.transmission?.toUpperCase(),
    drivetrain: input.drivetrain?.toUpperCase(),

    market: input.country,

    confidence: calculateIdentityConfidence(input),
  };
}

function parseEngineSize(
  engineSize: string
): number | undefined {
  const match = engineSize.match(
    /(\d+(?:\.\d+)?)\s*L?/i
  );

  if (!match) {
    return undefined;
  }

  const displacement = Number(match[1]);

  return Number.isFinite(displacement)
    ? displacement
    : undefined;
}

function calculateIdentityConfidence(
  input: VehicleIdentityInput
): number {
  let confidence = 0;

  if (input.brand) confidence += 0.2;
  if (input.model) confidence += 0.2;
  if (input.year) confidence += 0.2;
  if (input.engineSize) confidence += 0.15;
  if (input.fuelType) confidence += 0.1;
  if (input.transmission) confidence += 0.1;
  if (input.drivetrain) confidence += 0.05;

  return Number(Math.min(confidence, 1).toFixed(2));
}