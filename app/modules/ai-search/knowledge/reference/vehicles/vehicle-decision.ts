import type {
  VehicleCandidateSelection,
} from "./select-best-candidate";

export type VehicleIdentificationDecision =
  | "CONFIRMED"
  | "LIKELY"
  | "NEEDS_CONFIRMATION"
  | "AMBIGUOUS"
  | "NO_MATCH";

export interface VehicleDecision {
  decision: VehicleIdentificationDecision;

  confidence: number;

  reason: string;

  selection: VehicleCandidateSelection | null;
}

export function decideVehicleIdentification(
  selection: VehicleCandidateSelection | null
): VehicleDecision {
  /**
   * No candidate means the reference database
   * could not find a matching vehicle.
   */
  if (!selection) {
    return {
      decision: "NO_MATCH",
      confidence: 0,
      reason:
        "No vehicle candidates matched the supplied brand, model, and year.",
      selection: null,
    };
  }

  /**
   * Multiple candidates are sufficiently close
   * that automatically selecting one could be unsafe.
   */
  if (selection.isAmbiguous) {
    return {
      decision: "AMBIGUOUS",
      confidence: selection.confidence,
      reason:
        "Multiple vehicle variants have similar matching scores.",
      selection,
    };
  }

  /**
   * Very strong identification.
   *
   * The candidate matched strongly and the supplied
   * evidence provides enough specificity.
   */
  if (
    selection.confidence >= 0.85 &&
    selection.identificationStrength >= 0.7
  ) {
    return {
      decision: "CONFIRMED",
      confidence: selection.confidence,
      reason:
        "The vehicle has a strong configuration match with sufficient identifying evidence.",
      selection,
    };
  }

  /**
   * Good match, but not strong enough to call it
   * fully confirmed.
   */
  if (selection.confidence >= 0.65) {
    return {
      decision: "LIKELY",
      confidence: selection.confidence,
      reason:
        "The vehicle is the strongest available candidate, but some identifying information is missing.",
      selection,
    };
  }

  /**
   * We found a candidate, but the available evidence
   * is not strong enough for automatic identification.
   */
  return {
    decision: "NEEDS_CONFIRMATION",
    confidence: selection.confidence,
    reason:
      "Additional vehicle information is required before confidently identifying the exact variant.",
    selection,
  };
}