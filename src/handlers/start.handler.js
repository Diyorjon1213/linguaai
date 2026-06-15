import bot from "../bot/bot.js";
import userService from "../services/user.service.js";
import { mainMenuKeyboard } from "../utils/keyboard.js";

class StartHandler {
  handle() {
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || "Do'st";

      // Foydalanuvchini ro'yxatga olish yoki olish
      userService.getUser(chatId, firstName);

      const text =
        `👋 *Assalomu alaykum, ${firstName}!*\n\n` +
        `🤖 *LinguaAI* botiga xush kelibsiz!\n\n` +
        `Bu bot orqali siz:\n` +
        `📚 Yangi ingliz so'zlarini o'rganasiz\n` +
        `🧠 Quiz orqali bilimingizni sinaysiz\n` +
        `🤖 AI o'qituvchi bilan suhbatlashasiz\n` +
        `📊 O'z yutuqlaringizni ko'rasiz\n\n` +
        `Quyidagi menyudan boshlang 👇`;

      bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        ...mainMenuKeyboard,
      });
    });
  }
}

export default StartHandler;
