import type { KnowledgeEvidence } from "./evidence";

export interface KnowledgeFact<T> {
  value: T;
  evidence: KnowledgeEvidence<T>[];
  confidence: number;
  verifiedAt: string;
}