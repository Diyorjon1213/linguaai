import bot from "../bot/bot.js";
import userService from "../services/user.service.js";
import wordService from "../services/word.service.js";
import { flashcardKeyboard, mainMenuKeyboard } from "../utils/keyboard.js";

class FlashcardHandler {
  handle() {
    bot.onText(/📚 So'z o'rganish/, (msg) => {
      this.sendWord(msg.chat.id, msg.from?.first_name);
    });
  }

  async handleCallback(query) {
    const { data } = query;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    if (data === "new_word") {
      await bot.answerCallbackQuery(query.id);
      await this._deleteMessage(chatId, messageId);
      this.sendWord(chatId);
      return true;
    }

    if (data.startsWith("know_") || data.startsWith("dontknow_")) {
      const wordId = parseInt(data.split("_")[1]);
      const word = wordService.getWordById(wordId);
      if (!word) return true;

      if (data.startsWith("know_")) {
        userService.markWordLearned(chatId, wordId);
        await bot.answerCallbackQuery(query.id, {
          text: `✅ Barakalla! "${word.word}" o'rganildi!`,
          show_alert: false
        });
      } else {
        await bot.answerCallbackQuery(query.id, {
          text: `📌 "${word.word}" keyinroq takrorlanadi.`,
          show_alert: false
        });
      }

      await this._deleteMessage(chatId, messageId);
      setTimeout(() => this.sendWord(chatId), 800);
      return true;
    }

    return false;
  }

  async sendWord(chatId, firstName = "") {
    const user = userService.getUser(chatId, firstName);
    const word = wordService.getRandomWord(user.learnedWords);

    if (!word) {
      return bot.sendMessage(
        chatId,
        "🎉 *Tabriklayman!*\n\nSiz barcha mavjud so'zlarni o'rgandingiz!\n\nQuiz yoki statistikani ko'ring.",
        { parse_mode: "Markdown", ...mainMenuKeyboard }
      );
    }

    const learned = user.learnedWords.length;
    const total = wordService.getTotalCount();
    const difficultyEmoji =
      { easy: "🟢", medium: "🟡", hard: "🔴" }[word.difficulty] || "⚪";

    const text =
      `📝 *Yangi so'z* (${learned}/${total})\n\n` +
      `🔤 *${word.word}*${word.transcription ? ` _${word.transcription}_` : ""}\n\n` +
      `🇺🇿 *Tarjimasi:* ${word.translation}\n\n` +
      (word.example ? `💬 *Misol:*\n_${word.example}_\n` : "") +
      `${difficultyEmoji} Daraja: ${word.difficulty}`;

    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...flashcardKeyboard(word.id)
    });
  }

  async _deleteMessage(chatId, messageId) {
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch {
      // xabar allaqachon o'chirilgan
    }
  }
}

export default FlashcardHandler;
