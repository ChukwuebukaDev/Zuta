import { ai } from "./gemini";
import { SEARCH_SYSTEM_PROMPT } from "./prompt";
import { SEARCH_RESPONSE_SCHEMA } from "./schema";

export async function interpretSearchQuery(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SEARCH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: SEARCH_RESPONSE_SCHEMA,
      temperature: 0,
    },
  });

  if (!result.text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(result.text);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}