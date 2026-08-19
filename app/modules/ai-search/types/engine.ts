import type { KnowledgeFact } from "./fact";

export type EngineAspiration =
  | "NATURALLY_ASPIRATED"
  | "TURBO"
  | "SUPERCHARGED";

export interface EngineFacts {
  displacementLiters: KnowledgeFact<number>;
  cylinders?: KnowledgeFact<number>;
  horsepower?: KnowledgeFact<number>;
  aspiration?: KnowledgeFact<EngineAspiration>;
}