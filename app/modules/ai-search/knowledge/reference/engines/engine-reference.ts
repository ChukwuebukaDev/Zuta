import type { EngineFacts } from "@/app/modules/ai-search/types/engine";
import type {KnowledgeSource} from "@/app/modules/ai-search/types/source";

/**
 * A verified knowledge entry for an engine.
 *
 * Engine code is used as the stable identifier because
 * the same engine can appear across multiple vehicle
 * generations and models.
 */
export interface EngineKnowledgeReference {
  engineCode: string;

  facts: EngineFacts;
}

/**
 * Source used for the current verified engine facts.
 *
 * We keep the source explicitly attached to the knowledge
 * so every fact can eventually be traced back to evidence.
 */
const TOYOTA_ENGINE_SOURCE: KnowledgeSource = {
  type: "MANUFACTURER",
  name: "Toyota",
  verifiedAt: "2026-08-17",
};

/**
 * Verified engine knowledge reference.
 *
 * This is intentionally small for now.
 *
 * We will expand the repository as we add more engines
 * and more verified facts.
 */
export const ENGINE_KNOWLEDGE_REFERENCE:
  EngineKnowledgeReference[] = [
    {
      engineCode: "2ZR-FE",

      facts: {
        displacementLiters: {
          value: 1.797,

          evidence: [
            {
              value: 1.797,
              source: TOYOTA_ENGINE_SOURCE,
            },
          ],

          confidence: 1,
          verifiedAt: "2026-08-17",
        },

        cylinders: {
          value: 4,

          evidence: [
            {
              value: 4,
              source: TOYOTA_ENGINE_SOURCE,
            },
          ],

          confidence: 1,
          verifiedAt: "2026-08-17",
        },
      },
    },
  ];