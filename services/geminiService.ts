
import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from '../constants';

const SYSTEM_INSTRUCTION = `
Eres 'María', la asistente virtual experta de Casa María Burguer.
Tu objetivo es ayudar a los clientes a elegir la mejor hamburguesa, explicar ingredientes y sugerir acompañamientos.
Conoces el menú a la perfección:
${JSON.stringify(MENU_ITEMS.map(i => `${i.name}: ${i.description} ($${i.price})`)).substring(0, 5000)}

Reglas:
1. Sé amable, divertida y muy breve.
2. Si preguntan por ubicación, menciona que está en la sección de Ubicación.
3. Si quieren pedir, diles que agreguen productos al carrito.
4. Responde siempre en Español.
5. Usa emojis de comida 🍔🍟🥤.
`;

export const sendMessageToGemini = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string
): Promise<string> => {
  try {
    // Initialize GoogleGenAI right before use to ensure the correct environment variables are captured
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // response.text is a property, not a method.
    return response.text || "¡Ups! Se me cayó la hamburguesa (error de conexión). ¿Me repites eso?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, estoy teniendo problemas técnicos en la cocina. Intenta de nuevo más tarde.";
  }
};
