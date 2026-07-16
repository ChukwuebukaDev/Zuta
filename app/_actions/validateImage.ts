
"use server";

export async function verifyVehiclePerspective(base64Image: string, expectedAngle: string): Promise<{ isValid: boolean; reason?: string }> {
  if (!process.env.OPENAI_API_KEY)   return { isValid: true };
  

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `You are an automotive marketplace moderator. Analyze this image. Does it accurately show the "${expectedAngle}" view of a motor vehicle? Reply with JSON format matching: { "isValid": true/false, "reason": "Short phrase explaining why if false" }. Be reasonable: if it matches the angle, pass it.` 
              },
              { 
                type: "image_url", 
                image_url: { url: `data:image/jpeg;base64,${base64Image}` } 
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 60,
      }),
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0]?.message?.content || "{}");
    
    return {
      isValid: content.isValid ?? true,
      reason: content.reason || "Incorrect vehicle perspective."
    };
  } catch (error) {
    console.error("AI Verification failed:", error);
    return { isValid: true }; // Fallback to avoid breaking uploads on network hitches
  }
}