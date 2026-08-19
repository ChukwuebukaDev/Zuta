import type { EngineFacts } from "@/app/modules/ai-search/types/engine";

export const ENGINE_REFERENCE: Record<
  string,
  EngineFacts
> = {
  "2ZR-FE": {
    displacementLiters: {
      value: 1.797,
      evidence: [
        {
          value: 1.797,
          source: {
            type: "MANUFACTURER",
            name: "Toyota Motor Corporation",
            url: "https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60004229/",
            confidence: 1,
            verifiedAt: "2026-08-17",
          },
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
          source: {
            type: "MANUFACTURER",
            name: "Toyota Motor Corporation",
            url: "https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60004229/",
            confidence: 1,
            verifiedAt: "2026-08-17",
          },
        },
      ],
      confidence: 1,
      verifiedAt: "2026-08-17",
    },
  },
};