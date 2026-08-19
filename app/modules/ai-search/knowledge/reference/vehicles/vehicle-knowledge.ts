import type { VehicleVariantReference } from "./types";
import type { EngineFacts } from "@/app/modules/ai-search/types/engine";
import {
  ENGINE_KNOWLEDGE_REFERENCE,
} from "../engines/engine-reference";


/**
 * Resolve engine knowledge directly from an engine code.
 *
 * Engine knowledge is independent of the exact vehicle
 * variant because the same engine can appear in multiple
 * vehicles.
 */
export function resolveEngineKnowledge(
  engineCode: string
): EngineFacts | null {
  const normalizedEngineCode =
    engineCode.trim().toUpperCase();

  const reference =
    ENGINE_KNOWLEDGE_REFERENCE.find(
      (engine) =>
        engine.engineCode.toUpperCase() ===
        normalizedEngineCode
    );

  if (!reference) {
    return null;
  }

  return reference.facts;
}

/**
 * Resolve engine knowledge from a vehicle variant.
 *
 * This is a convenience wrapper around the engine-code
 * resolver.
 */
export function resolveVehicleEngineKnowledge(
  vehicle: VehicleVariantReference
): EngineFacts | null {
  if (!vehicle.engineCode) {
    return null;
  }

  return resolveEngineKnowledge(
    vehicle.engineCode
  );
}