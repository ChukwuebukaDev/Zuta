import type { KnowledgeSource } from "./source";

export interface KnowledgeEvidence<T = unknown> {
  value: T;
  source: KnowledgeSource;
}