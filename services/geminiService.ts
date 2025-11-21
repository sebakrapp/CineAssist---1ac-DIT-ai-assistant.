import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Store active chat session to maintain context
let chatSession: Chat | null = null;

/**
 * Initializes or resets the chat session with system instructions and tools.
 * We use the search tool to ensure up-to-date info on firmware/menus.
 */
export const initChatSession = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }], // Enable grounding for accurate specs/firmware
      temperature: 0.4, // Low temperature for precise technical instructions
    },
  });
  return chatSession;
};

/**
 * Sends a message to the model and yields chunks of text as they stream in.
 * Supports text and optional image input.
 */
export async function* sendMessageStream(message: string, imageBase64?: string) {
  if (!chatSession) {
    initChatSession();
  }

  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  try {
    let msgPayload: string | Array<any> = message;

    if (imageBase64) {
        // Strip prefix if present (data:image/jpeg;base64,) because inlineData expects just the base64 string
        const base64Data = imageBase64.split(',')[1];
        const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
        
        msgPayload = [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            },
            { text: message || "Analyze this image" }
        ];
    }

    // @ts-ignore: SDK allows parts array for message, though types might suggest string only in strict mode
    const result = await chatSession.sendMessageStream({ message: msgPayload });

    for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        
        // Extract text
        const text = c.text || '';
        
        // Extract grounding metadata (sources) if present
        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        let sources: Array<{uri: string, title: string}> = [];
        
        if (groundingChunks) {
            sources = groundingChunks
                .map(chunk => chunk.web)
                .filter((web): web is { uri: string; title: string } => 
                    !!web && typeof web.uri === 'string' && typeof web.title === 'string'
                );
        }

        yield { text, sources };
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
}

export const resetSession = () => {
  chatSession = null;
  initChatSession();
};