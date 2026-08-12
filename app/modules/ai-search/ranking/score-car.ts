import type { SearchPriority } from "../search/schema";
import type { PriorityWeight } from "../search/use-case-config";

type CarKnowledgeScores = Record<SearchPriority, number>;

export function scoreCar(
  scores: CarKnowledgeScores,
  priorities: PriorityWeight[]
): number {
  if (priorities.length === 0) {
    return 0;
  }

  const total = priorities.reduce((sum, item) => {
    const score = scores[item.priority] ?? 0;

    return sum + score * item.weight;
  }, 0);

  return +total.toFixed(2);
}