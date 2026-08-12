import { findCars } from "./find-cars";
import { rankCars } from "../ranking/rank-cars";
import { buildSearch } from "./build-search";
import type { SearchIntent } from "./schema";

export async function searchCars(intent: SearchIntent) {
  // 1. Convert intent into database filters + ranking priorities
  const searchPlan = buildSearch(intent);

  // 2. Get cars that satisfy the hard filters
  const cars = await findCars(searchPlan.filters);

  // 3. Rank those cars using vehicle knowledge
  const rankedCars = rankCars(
    cars,
    searchPlan.priorities
  );

  return rankedCars;
}