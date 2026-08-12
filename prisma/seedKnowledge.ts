import {prisma as db} from '@/lib/prisma';
import { searchCars } from "@/app/modules/ai-search/search/search-cars";
import type { SearchIntent } from "@/app/modules/ai-search/search/schema";

async function main() {

  const knowledge = await db.carKnowledge.findUnique({
  where: {
    brand_model_generation: {
      brand: "Toyota",
      model: "Corolla",
      generation: "E170",
    },
  },
});

if (!knowledge) {
  throw new Error("Toyota Corolla E170 knowledge not found");
}
await db.car.update({
  where: {
    id: "cmrtrpvwg0001jx04efrs74d0",
  },
  data: {
    knowledgeId: knowledge.id,
  },
});
const intent: SearchIntent = {
  brand: null,
  model: null,
  minPrice: null,
  maxPrice: 9500000,
  bodyType: null,
  condition: null,
  fuelType: null,
  transmission: null,
  useCase: "FAMILY",
  priorities: [
    "fuelEfficiency",
  ],
};
const results = await searchCars(intent);

 console.dir(results, { depth: null });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });