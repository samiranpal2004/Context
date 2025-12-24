
import { GoogleGenAI, Type } from "@google/genai";
import { Memory } from "../types";

// Note: In a real app, API_KEY should be in process.env.API_KEY
const API_KEY = process.env.API_KEY || '';

class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generateChatResponse(question: string, context: Memory[]) {
    if (!API_KEY) return { text: "Please set your Gemini API key to use Chat." };

    const contextStr = context.map(m => `Title: ${m.title}\nSummary: ${m.summary}\nURL: ${m.url}`).join('\n\n');
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are "Context AI", a personal second brain assistant. Use the following memory context to answer the user's question accurately.
      
      Memory Context:
      ${contextStr}
      
      User Question: ${question}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return { text: response.text };
  }

  async getSemanticRelevance(query: string, memories: Memory[]): Promise<(Memory & { similarity: number })[]> {
     if (!API_KEY) return memories.map(m => ({ ...m, similarity: 0.5 }));

     // Simplified semantic similarity logic using Gemini for scoring
     const response = await this.ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `Evaluate the relevance of these memories to the search query: "${query}".
       Provide a relevance score from 0.0 to 1.0 for each.`,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
           type: Type.ARRAY,
           items: {
             type: Type.OBJECT,
             properties: {
               id: { type: Type.STRING },
               score: { type: Type.NUMBER }
             },
             required: ["id", "score"]
           }
         }
       }
     });

     try {
       const scores = JSON.parse(response.text);
       return memories.map(m => {
         const scoreObj = scores.find((s: any) => s.id === m.id);
         return { ...m, similarity: scoreObj ? scoreObj.score : 0 };
       }).sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
     } catch (e) {
       return memories.map(m => ({ ...m, similarity: 0 }));
     }
  }
}

export const geminiService = new GeminiService();
