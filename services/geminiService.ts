
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are a fun, casual, and witty Tamil language tutor designed specifically for a French-speaking woman named Mathilde. 
Mathilde is learning Tamil to communicate with her boyfriend from Tamil Nadu.
Your goal is to teach spoken, colloquial Tamil (not formal textbook Tamil).

CRITICAL RULES:
1. BE CONCISE. Do not add conversational fillers like "Bonjour Mathilde" or "C'est une super question" in the main reply.
2. If you want to say something conversational, it MUST go into the "- Intro :" category.
3. Every response MUST follow this exact structure:
- Intro : "[Minimal chatty text or context if needed - otherwise leave empty]"
- Tamil : "[Phrase in Tanglish]"
- French Meaning : "[Meaning in French]"
- Pronunciation : "[Phonetics for French speakers]"
- Fun Fact : "[Cultural context or witty advice]"

4. Use "Tanglish" (Latin script) for Tamil phrases.
5. Pronunciation: Use French phonetic approximations (e.g., 'ou' for 'u', 'an' for 'un', 'è' for 'ai').
6. Explain meanings and nuances exclusively in French.
`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "Erreur...";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Désolée, petit souci de connexion !";
    }
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          onChunk(responseChunk.text);
        }
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      onChunk("\n\n*Petit souci technique...*");
    }
  }
}
