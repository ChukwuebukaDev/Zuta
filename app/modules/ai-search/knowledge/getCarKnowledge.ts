import { prisma as db } from "@/lib/prisma";
import { parseCarKnowledge } from "./parseCarKnowledge";

export async function getCarKnowledge(
  brand: string,
  model: string,
  generation?: string
) {
  const knowledge = await db.carKnowledge.findFirst({
    where: {
      brand,
      model,
      ...(generation ? { generation } : {}),
    },
  });

  if (!knowledge) {
    return null;
  }

  return {
    ...knowledge,
    attributes: parseCarKnowledge(knowledge.attributes),
  };
}