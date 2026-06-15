import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const SYSTEM_PROMPT = `Sen ingliz tili o'qituvchisisisan va Telegram bot orqali ishlaysan.
Vazifang: foydalanuvchiga ingliz tilini o'rgatish va mashq qildirish.

Qoidalar:
1. Har doim ingliz tilida javob ber.
2. Agar foydalanuvchi o'zbek tilida yozsa — ingliz tilida javob ber, lekin qavs ichida o'zbek tarjimasini ham ber.
3. Grammatik xatolarni muloyimlik bilan tuzat.
4. Yangi so'z yoki ibora o'rgatmoqchi bo'lsang — tarjimasi bilan birga yoz.
5. Javob qisqa va aniq bo'lsin (3-5 jumla), ortiqcha bo'lmasin.
6. Foydalanuvchini rag'batlantirib tur.
7. Hech qachon Markdown formatlash ishlatma (**, *, __ va h.k.) — oddiy matn yoz.`;

class AiService {
  constructor() {
    this.model = genAI.getGenerativeModel({
      model: config.geminiModel,
      systemInstruction: SYSTEM_PROMPT
    });
  }

  async getResponse(userMessage, history = []) {
    try {
      const chat = this.model.startChat({
        history: history,
        generationConfig: { maxOutputTokens: config.aiMaxTokens }
      });

      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API xatosi:", error.message);
      return "Sorry, I could not respond right now. Please try again. (Kechirasiz, hozircha javob bera olmayapman.)";
    }
  }
}

export default new AiService();
