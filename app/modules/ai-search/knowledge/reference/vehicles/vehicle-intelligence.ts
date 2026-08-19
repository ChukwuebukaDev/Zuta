import {
  resolveVehicleIdentity,
  type VehicleIdentityInput,
} from "@/app/modules/ai-search/intelligence/identity/resolve-vehicle";

import { findVehicleCandidates } from "./find-vehicles";
import { selectBestVehicleCandidate } from "./select-best-candidate";
import {
  decideVehicleIdentification,
  type VehicleDecision,
} from "./vehicle-decision";

import { resolveEngineKnowledge,} from "./vehicle-knowledge";

import type { EngineFacts } from "@/app/modules/ai-search/types/engine";

/**
 * Complete result of the vehicle intelligence pipeline.
 *
 * This object intentionally keeps the individual stages
 * visible instead of hiding everything behind one value.
 *
 * This makes the system easier to debug and explain later.
 */
export interface VehicleIntelligenceResult {
  /**
   * Normalized identity extracted from the input.
   */
  identity: ReturnType<typeof resolveVehicleIdentity>;

   /**
   * True when all competitive candidates agree
   * on the same engine code.
   */
  engineIdentified: boolean;
  /**
   * All reference candidates matching the vehicle's
   * core identity (brand, model, year).
   */
  candidates: ReturnType<typeof findVehicleCandidates>;

  /**
   * Candidate ranking and confidence information.
   */
  selection: ReturnType<
    typeof selectBestVehicleCandidate
  >;

  /**
   * Final application-level identification decision.
   */
  decision: VehicleDecision;

  /**
   * Verified engine knowledge when the vehicle has
   * been identified sufficiently and knowledge exists.
   */
  engineFacts: EngineFacts | null;
}

/**
 * Runs the complete vehicle intelligence pipeline.
 *
 * Flow:
 *
 * 1. Normalize vehicle identity
 * 2. Find matching reference candidates
 * 3. Rank candidates
 * 4. Calculate confidence
 * 5. Make an identification decision
 * 6. Resolve verified engine knowledge
 */
export function resolveVehicleIntelligence(
  input: VehicleIdentityInput
): VehicleIntelligenceResult {
  /**
   * Stage 1
   *
   * Normalize the raw vehicle input.
   */
  const identity =
    resolveVehicleIdentity(input);
     let engineIdentified = false;

  /**
   * Stage 2
   *
   * Find all vehicles matching:
   *
   * brand + model + year
   */
  const candidates =
    findVehicleCandidates(input);

  /**
   * Stage 3
   *
   * Score and rank the candidates.
   */
  const selection =
    selectBestVehicleCandidate(
      input,
      candidates
    );

  /**
   * Stage 4
   *
   * Convert the raw ranking information into an
   * application-level decision.
   */
  const decision =
    decideVehicleIdentification(
      selection
    );

  /**
   * Stage 5
   *
   * Only resolve engine knowledge when we actually
   * have a selected vehicle.
   *
   * We intentionally do NOT resolve knowledge from
   * arbitrary candidates.
   */
  let engineFacts: EngineFacts | null = null;
/**
 * Engine knowledge can sometimes be resolved even when
 * the exact vehicle variant is ambiguous.
 *
 * Example:
 *
 * Corolla E140 2ZR-FE Automatic
 * Corolla E140 2ZR-FE Manual
 *
 * The transmission is unknown, but both candidates
 * identify the same engine.
 */
if (selection) {
  const engineCodes = [
    ...new Set(
      selection.competitiveCandidates
        .map(
          (match) =>
            match.candidate.engineCode
        )
        .filter(
          (
            engineCode
          ): engineCode is string =>
            Boolean(engineCode)
        )
        .map((engineCode) =>
          engineCode.toUpperCase()
        )
    ),
  ];

  /**
   * We can safely resolve engine knowledge only when
   * all competitive candidates point to the same engine.
   */
 
  if (engineCodes.length === 1) {
    engineIdentified = true;
    engineFacts =
      resolveEngineKnowledge(
        engineCodes[0]
      );
  }
}

  return {
    engineIdentified,
    identity,
    candidates,
    selection,
    decision,
    engineFacts,
  };
}