import bot from "../bot/bot.js";
import aiService from "../services/ai.service.js";
import { aiMenuKeyboard, mainMenuKeyboard } from "../utils/keyboard.js";
import subscriptionService from "../services/subscription.service.js";
import checkSubscription from "../middleware/subscription.middleware.js";

const aiModeUsers = new Set();

class AiHandler {
  handle() {
    bot.onText(/🤖 AI bilan suhbat/, (msg) => {
      const chatId = msg.chat.id;
      aiModeUsers.add(chatId);

      bot.sendMessage(
        chatId,
        "🤖 *AI Ingliz tili o'qituvchisi*\n\n" +
          "Salom! Men sizning shaxsiy ingliz tili o'qituvchingizman.\n\n" +
          "• Ingliz tilida yozing — men javob beraman\n" +
          "• O'zbek tilida yozsangiz — ingliz tilida tushuntiraman\n" +
          "• Grammatik xatolaringizni tuzataman\n\n" +
          "Mashqni boshlaymiz! Biror narsa so'rang yoki inglizcha gaplashing 👇\n\n" +
          "_Asosiy menyuga qaytish uchun tugmani bosing._",
        {
          parse_mode: "Markdown",
          ...aiMenuKeyboard
        }
      );
    });

    bot.onText(/🏠 Asosiy menyuga qaytish/, (msg) => {
      const chatId = msg.chat.id;
      aiModeUsers.delete(chatId);

      bot.sendMessage(
        chatId,
        "🏠 *Asosiy menyu*\n\nQuyidagi bo'limlardan birini tanlang:",
        {
          parse_mode: "Markdown",
          ...mainMenuKeyboard
        }
      );
    });

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text || !aiModeUsers.has(chatId)) return;
      if (this._isMenuCommand(text)) return;

      const allowed = await checkSubscription(chatId);
      if (!allowed) {
        subscriptionService.sendSubscribeMessage(chatId);
        return;
      }

      bot.sendChatAction(chatId, "typing");

      const response = await aiService.getResponse(text);

      bot.sendMessage(chatId, response);
    });
  }

  _isMenuCommand(text) {
    const menuItems = [
      "/start",
      "📚 So'z o'rganish",
      "🧠 Quiz / Test",
      "🤖 AI bilan suhbat",
      "📊 Mening natijalarim",
      "ℹ️ Yordam",
      "🏠 Asosiy menyuga qaytish"
    ];
    return menuItems.some((item) => text === item || text.startsWith("/"));
  }
}

export default AiHandler;
