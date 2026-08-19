export type KnowledgeSourceType =
  | "MANUFACTURER"
  | "GOVERNMENT"
  | "SAFETY_DATABASE"
  | "FUEL_ECONOMY_DATABASE"
  | "RESEARCH"
  | "MARKET_DATA"
  | "AI"
  | "USER_SUBMITTED";


  
export interface KnowledgeSource {
  type: KnowledgeSourceType;
  name: string;
  url?: string;
  confidence?: number;
  verifiedAt: string;
}


