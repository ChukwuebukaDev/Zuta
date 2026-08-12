import { scoreCar } from "./score-car";
import type { PriorityWeight } from "../search/use-case-config";
import { CarKnowledgeAttributesSchema } from "../types/schema";

type CarWithKnowledge = {
  id: string;
  knowledge: {
    attributes: unknown;
  } | null;
};

export function rankCars(
  cars: CarWithKnowledge[],
  priorities: PriorityWeight[]
) {
  return cars
    .map((car) => {
      // No knowledge available.
      if (!car.knowledge) {
        return {
          car,
          score: null,
        };
      }

      const attributes =
        CarKnowledgeAttributesSchema.parse(
          car.knowledge.attributes
        );

      const scores = attributes.scores;

      if (!scores) {
        return {
          car,
          score: null,
        };
      }

      const score = scoreCar(scores, priorities);

      return {
        car,
        score,
      };
    })
    .sort((a, b) => {
      // Cars with knowledge are ranked first.
      if (a.score === null) return 1;
      if (b.score === null) return -1;

      return b.score - a.score;
    });
}