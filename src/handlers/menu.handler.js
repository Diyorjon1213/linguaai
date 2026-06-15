import bot from "../bot/bot.js";
import userService from "../services/user.service.js";
import wordService from "../services/word.service.js";
import { mainMenuKeyboard } from "../utils/keyboard.js";

class MenuHandler {
  handle() {
    bot.onText(/🏠 Asosiy menyuga qaytish/, (msg) => {
      this.showMainMenu(msg.chat.id);
    });

    bot.onText(/📊 Mening natijalarim/, (msg) => {
      this.showStats(msg.chat.id, msg.from?.first_name);
    });

    bot.onText(/ℹ️ Yordam/, (msg) => {
      this.showHelp(msg.chat.id);
    });
  }

  handleCallback(query) {
    if (query.data === "main_menu") {
      bot.answerCallbackQuery(query.id);
      this.showMainMenu(query.message.chat.id);
      return true;
    }
    return false;
  }

  showMainMenu(
    chatId,
    text = "🏠 *Asosiy menyu*\n\nQuyidagi bo'limlardan birini tanlang:"
  ) {
    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...mainMenuKeyboard
    });
  }

  showStats(chatId, firstName = "") {
    const user = userService.getUser(chatId, firstName);
    const totalWords = wordService.getTotalCount();
    const { stats, learnedWords } = user;

    const accuracy =
      stats.totalQuizzes > 0
        ? Math.round((stats.totalCorrect / (stats.totalQuizzes * 5)) * 100)
        : 0;

    const streakEmoji =
      stats.currentStreak >= 7 ? "🔥" : stats.currentStreak >= 3 ? "⚡" : "📅";

    const text =
      `📊 *Sizning natijalaringiz*\n\n` +
      `📚 So'z o'rganish:\n` +
      `• O'rganilgan: *${learnedWords.length}* / ${totalWords} so'z\n` +
      `• Progress: ${this._progressBar(learnedWords.length, totalWords)}\n\n` +
      `🧠 Quiz natijasi:\n` +
      `• O'ynalgan quizlar: *${stats.totalQuizzes}*\n` +
      `• To'g'ri javoblar: *${stats.totalCorrect}*\n` +
      `• Aniqlik: *${accuracy}%*\n\n` +
      `${streakEmoji} Ketma-ket kunlar: *${stats.currentStreak}*\n\n` +
      `${this._motivationText(learnedWords.length, totalWords)}`;

    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...mainMenuKeyboard
    });
  }

  showHelp(chatId) {
    const text =
      `ℹ️ *LinguaAI Bot — Yordam*\n\n` +
      `📚 *So'z o'rganish*\n` +
      `Yangi ingliz so'zlarini flashcard usulida o'rganing.\n` +
      `✅ Bilaman — so'z o'rganilgan deb belgilanadi\n` +
      `❓ Bilmayman — keyinroq qayta keladi\n\n` +
      `🧠 *Quiz / Test*\n` +
      `5 ta savol — inglizcha so'zning o'zbek tarjimasini toping.\n` +
      `Teskari quiz ham bor: o'zbek → ingliz!\n\n` +
      `🤖 *AI bilan suhbat*\n` +
      `Sun'iy intellekt o'qituvchi bilan ingliz tilida gaplashing.\n` +
      `Xato yozsangiz — tuzatib beradi, yangi so'zlar o'rgatadi.\n\n` +
      `📊 *Natijalar*\n` +
      `O'z progressingizni, streak va quizlar natijasini ko'ring.\n\n` +
      `❓ Muammo yuzaga kelsa — /start ni bosing.`;

    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...mainMenuKeyboard
    });
  }

  _progressBar(current, total) {
    if (total === 0) return "▱▱▱▱▱▱▱▱▱▱ 0%";
    const pct = Math.min(Math.round((current / total) * 100), 100);
    const filled = Math.round(pct / 10);
    const bar = "▰".repeat(filled) + "▱".repeat(10 - filled);
    return `${bar} ${pct}%`;
  }

  _motivationText(learned, total) {
    if (total === 0) return "📖 So'zlar hali qo'shilmagan.";
    const pct = (learned / total) * 100;
    if (pct === 100) return "🏆 Ajoyib! Barcha so'zlarni o'rgandingiz!";
    if (pct >= 75) return "🌟 Zo'r! Maqsadga yaqinlashyapsiz!";
    if (pct >= 50) return "💪 Yaxshi tempo! Davom eting!";
    if (pct >= 25) return "🚀 Yaxshi boshlanish! Ko'proq mashq qiling!";
    return "📚 Kuniga 5-10 ta so'z o'rganing — natija ko'rasiz!";
  }
}

export default MenuHandler;
