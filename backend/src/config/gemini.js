import { GoogleGenAI } from "@google/genai";

// Initialize with API key
export const genAI = new GoogleGenAI({});

export async function testGemini() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello!"
    });
    console.log('✅ API key works!');
    console.log('Response:', response.text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Export model names as constants
export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  EMBEDDING: 'gemini-embedding-001'
};