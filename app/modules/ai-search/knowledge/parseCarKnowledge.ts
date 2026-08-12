import {
  CarKnowledgeAttributesSchema,
  type CarKnowledgeAttributes,
} from "../types/schema";

export function parseCarKnowledge(
  attributes: unknown
): CarKnowledgeAttributes {
  return CarKnowledgeAttributesSchema.parse(attributes);
}