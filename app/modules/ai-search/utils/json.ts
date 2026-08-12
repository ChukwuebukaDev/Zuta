import {Prisma} from "@prisma/client";

export function toPrismaJson<T extends object>(
  value: T
): Prisma.InputJsonObject {
  return value as Prisma.InputJsonObject;
}