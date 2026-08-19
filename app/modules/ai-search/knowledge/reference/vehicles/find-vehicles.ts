import type { VehicleIdentityInput } from "@/app/modules/ai-search/intelligence/identity/resolve-vehicle";
import type { VehicleVariantReference } from "./types";
import { VEHICLE_VARIANT_REFERENCE } from "./data";

export function findVehicleCandidates(
  input: VehicleIdentityInput
): VehicleVariantReference[] {
  const brand = input.brand.trim().toLowerCase();
  const model = input.model.trim().toLowerCase();

  return VEHICLE_VARIANT_REFERENCE.filter((vehicle) => {
    const sameBrand =
      vehicle.brand.toLowerCase() === brand;

    const sameModel =
      vehicle.model.toLowerCase() === model;

    const sameYear =
      input.year >= vehicle.yearFrom &&
      input.year <= vehicle.yearTo;

    return sameBrand && sameModel && sameYear;
  });
}