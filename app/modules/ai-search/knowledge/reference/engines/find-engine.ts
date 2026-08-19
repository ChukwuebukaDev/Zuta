import type { EngineFacts } from "@/app/modules/ai-search/types/engine";
import { ENGINE_REFERENCE } from "./data";

export function findEngineByCode(
  engineCode: string
): EngineFacts | null {
  const normalizedCode = engineCode
    .trim()
    .toUpperCase();

  return ENGINE_REFERENCE[normalizedCode] ?? null;
}