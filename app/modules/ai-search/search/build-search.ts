import type { SearchIntent } from "./schema";
import {
  USE_CASE_PRIORITIES,
  type PriorityWeight,
} from "./use-case-config";

const USER_PRIORITY_BOOST = 1.5;

function normalizeWeights(
  priorities: PriorityWeight[]
): PriorityWeight[] {
  const total = priorities.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  if (total === 0) {
    return priorities;
  }

  return priorities.map((item) => ({
    ...item,
    weight: item.weight / total,
  }));
}

export function buildSearch(intent: SearchIntent) {
  const hardFilters = {
    brand: intent.brand,
    model: intent.model,
    minPrice: intent.minPrice,
    maxPrice: intent.maxPrice,
    bodyType: intent.bodyType,
    condition: intent.condition,
    fuelType: intent.fuelType,
    transmission: intent.transmission,
  };

  const useCasePriorities: PriorityWeight[] = intent.useCase
    ? USE_CASE_PRIORITIES[intent.useCase]
    : [];

  const priorityMap = new Map<string, PriorityWeight>();

  // Start with the use-case defaults
  for (const item of useCasePriorities) {
    priorityMap.set(item.priority, { ...item });
  }

  // Boost priorities explicitly mentioned by the user
  for (const priority of intent.priorities) {
    const existing = priorityMap.get(priority);

    if (existing) {
      priorityMap.set(priority, {
        ...existing,
        weight: existing.weight * USER_PRIORITY_BOOST,
      });
    } else {
      // User asked for a priority that isn't part
      // of the default use-case priorities.
      priorityMap.set(priority, {
        priority,
        weight: 0.1,
      });
    }
  }

  const priorities = normalizeWeights(
    Array.from(priorityMap.values())
  );


  return {
    filters: hardFilters,
    priorities,
    useCase: intent.useCase ?? null,
  };
}