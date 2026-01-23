//servizio che esegue le richieste sulle diete

import DietInfo from "./infoModel.js";
import { GoogleGenAI } from "@google/genai";
import systemPrompt from "./systemPrompt.js";

//parole consentite
const allowedKeywords = [
  "dieta", "diete", "calorie", "kcal", "chilocalorie", "nutrizione",
  "ricetta", "ricette", "pasto", "pasti", "colazione", "colazioni",
  "merenda", "merende", "pranzo", "pranzi", "cena", "cene", "menu",
  "ingrediente", "ingredienti", "settimana", "settimane", "peso",
  "pesi", "dimagrire", "ingrassare", "kg", "anni", "intolleranze",
  "intollerante", "intolleranza", "preferenza", "preferisco",
  "allergia", "allergie", "grammi", "g", "preferenze"
];

const greetings = ["ciao", "salve", "buongiorno", "buonasera", "buon pomeriggio", "hey"];
const thanks = ["grazie", "perfetto", "ok"];

//salva la dieta
export const saveDiet = async (dietData) => {
  try {
    const { userId, settimana } = dietData;

    let foundDiet = await DietInfo.findOne({ userId });

    if (foundDiet) { //se la dieta esiste già, la aggiorna
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

//recupera la dieta
export const getDietByUserId = async (userId) => {
  try {
    return await DietInfo.findOne({ userId });
  } catch (error) {
    console.error("Errore service getDietByUserId:", error);
    throw error;
  }
};

//elimina la dieta
export const deleteDietByUserId = async (userId) => {
  try {
    return await DietInfo.deleteOne({ userId });
  } catch (error) {
    console.error("Errore service deleteDietByUserId:", error);
    throw error;
  }
};

//verifica che il messaggio contiene almeno una parola consentita
export function validateMessage(message) {
  const msg = message.toLowerCase();
  if (greetings.includes(msg)) return true; //se il messaggio è solo un saluto 
  if (thanks.includes(msg)) return true;  //se il messaggio è solo un ringraziamento 
  if (allowedKeywords.some(w => msg.includes(w))) return true; //se il messaggio contiene almeno una parola consentita
  return false;
}

//genera la risposta dell'LLM
export async function* generateChatResponse(messages) {
  try {
    //concatena systemPrompt + messaggio utente in un unico testo
    const fullPrompt = [
      systemPrompt,
      ...messages.map(m => m.content) //crea un array di messaggi
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

    //itera sui chunk di testo
    for await (const chunk of stream) {
      const text = chunk.text || "";
      yield text; // restituisce pezzi di testo man mano
    }
  } catch (err) {
    console.error("Errore Gemini SDK:", err);
    throw err;
  }
};

//client per comunicare con Gemini
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 