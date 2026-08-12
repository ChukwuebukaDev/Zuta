import { GoogleGenAI, Type } from "@google/genai";
import {
  SearchIntentSchema,
  type SearchIntent,
} from "./schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function interpretSearchQuery(
  prompt: string
): Promise<SearchIntent> {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,

    config: {
      systemInstruction: `
You are Zuta's natural-language automotive search interpreter.

Your ONLY job is to understand what the user is asking for
and extract their search intent.

Do NOT recommend specific cars.
Do NOT rank cars.
Do NOT invent vehicle specifications.

Extract only information explicitly stated or strongly implied
by the user's request.

Examples:

"Toyota Corolla under 10m"
→ brand: Toyota
→ model: Corolla
→ maxPrice: 10000000

"car around 6.5m for Uber"
→ maxPrice: 6500000
→ useCase: RIDESHARE

"reliable car with low fuel consumption"
→ priorities: reliability, fuelEfficiency

"family SUV under 15m"
→ bodyType: SUV
→ maxPrice: 15000000
→ useCase: FAMILY

For Nigerian currency:
"6.5m" means 6,500,000 NGN.
"10m" means 10,000,000 NGN.
"5 million" means 5,000,000 NGN.

Uber, Bolt, Taxify and ride-hailing imply:
useCase: RIDESHARE

Return only structured JSON.
`,

      temperature: 0.1,

      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          brand: {
            type: Type.STRING,
            nullable: true,
          },

          model: {
            type: Type.STRING,
            nullable: true,
          },

          minPrice: {
            type: Type.NUMBER,
            nullable: true,
          },

          maxPrice: {
            type: Type.NUMBER,
            nullable: true,
          },

          bodyType: {
            type: Type.STRING,
            nullable: true,
          },

          condition: {
            type: Type.STRING,
            nullable: true,
          },

          fuelType: {
            type: Type.STRING,
            nullable: true,
          },

          transmission: {
            type: Type.STRING,
            nullable: true,
          },

          useCase: {
            type: Type.STRING,
            nullable: true,
          },

          priorities: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },

        required: [
          "priorities",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const raw = JSON.parse(response.text);

  return SearchIntentSchema.parse(raw);
}