import DietInfo from "./infoModel.js";
import { GoogleGenAI } from "@google/genai";
import systemPrompt from "./systemPrompt.js";

/* 
  Service layer:
  Handles diet business logic and database operations.
  Called by the controller and returns structured results.
*/

// Allowed keywords for message validation
const allowedKeywords = [
  "dieta", "diete", "calorie", "kcal", "chilocalorie", "nutrizione",
  "ricetta", "ricette", "pasto", "pasti", "colazione", "colazioni",
  "merenda", "merende", "pranzo", "pranzi", "cena", "cene", "menu",
  "ingrediente", "ingredienti", "settimana", "settimane", "peso",
  "pesi", "dimagrire", "ingrassare", "kg", "anni", "intolleranze",
  "intollerante", "intolleranza", "preferenza", "preferenze", "preferisco",
  "allergia", "allergie", "grammi", "g"
];
const greetings = ["ciao", "salve", "buongiorno", "buonasera", "buon pomeriggio", "hey"];
const thanks = ["grazie", "perfetto", "ok", "bene"];

// Gemini client initialization
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Save a new diet
export const saveDiet = async (dietData) => {
  try {
    const { userId, settimana } = dietData;
    let foundDiet = await DietInfo.findOne({ userId });

    // Update existing diet or create a new one
    if (foundDiet) {
      foundDiet.settimana = settimana;
    } else {
      foundDiet = new DietInfo({ userId, settimana });
    }

    await foundDiet.save();
    return { status: true };
  } catch (err) {
    console.error(err);
    return { status: false, message: err.message };
  }
};

// Get diet information for a single user
export const getDietByUserId = async (userId) => {
  try {
    return await DietInfo.findOne({ userId });
  } catch (error) {
    console.error("Errore nel recupero della dieta: ", error);
    throw error;
  }
};

// Delete a user's diet
export const deleteDietByUserId = async (userId) => {
  try {
    return await DietInfo.deleteOne({ userId });
  } catch (error) {
    console.error("Errore nell'eliminazione della dieta: ", error);
    throw error;
  }
};

// Validate that the message is related to diet topics
export function validateMessage(message) {
  const msg = message.toLowerCase();
  if (greetings.includes(msg)) return true;
  if (thanks.includes(msg)) return true;
  if (allowedKeywords.some(w => msg.includes(w))) return true; // Check if the message contains at least one allowed keyword
  return false;
}

// Generate LLM response as async stream
export async function* generateChatResponse(messages) {
  try {
    // Combine system prompt and user messages
    const fullPrompt = [
      systemPrompt,
      ...messages.map(m => m.content)
    ].join("\n");
    const stream = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        {
          type: "text",
          text: fullPrompt
        }
      ]
    });
    for await (const chunk of stream) {
      const text = chunk.text || "";
      yield text; // Returns text chunks progressively

    }
  } catch (err) {
    console.error("Errore Gemini SDK:", err);
    throw err;
  }
};