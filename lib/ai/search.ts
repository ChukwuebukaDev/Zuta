import { ai } from "./gemini";
import { SEARCH_SYSTEM_PROMPT } from "./prompt";
import { SEARCH_RESPONSE_SCHEMA } from "./schema";

export async function interpretSearchQuery(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SEARCH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: SEARCH_RESPONSE_SCHEMA,
      temperature: 0,
    },
  });
  // Access the text properly from the response object
  const responseText = result.text;

  if (!responseText) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}
