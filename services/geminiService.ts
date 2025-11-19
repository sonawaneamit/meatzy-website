import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;

// Initialize securely using environment variable
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getRecipeSuggestion = async (ingredients: string, dietary?: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found.");
    return "I'm having trouble connecting to the kitchen right now. Please try again later.";
  }

  try {
    const prompt = `
      You are a world-class chef at Meatzy, a premium meat subscription company.
      Suggest a creative but accessible recipe using these ingredients: ${ingredients}.
      Dietary preference: ${dietary || 'None'}.
      Keep the response under 150 words. Format with a catchy title, ingredients list, and brief instructions.
      Use Markdown for formatting (bolding title, bullet points).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Sorry, I couldn't conjure up a recipe just yet.";
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return "Our chef is currently busy. Please try again in a moment.";
  }
};