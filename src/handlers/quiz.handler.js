import bot from "../bot/bot.js";
import quizService from "../services/quiz.service.js";
import userService from "../services/user.service.js";
import { Quiz } from "../models/Quiz.js";
import { quizOptionsKeyboard, mainMenuKeyboard } from "../utils/keyboard.js";

class QuizHandler {
  constructor() {
    this.activeQuizzes = new Map();
  }

  handle() {
    bot.onText(/🧠 Quiz \/ Test/, (msg) => {
      this.showQuizMenu(msg.chat.id);
    });
  }

  handleCallback(query) {
    const { data } = query;
    const chatId = query.message.chat.id;

    if (data === "quiz_start_normal") {
      bot.answerCallbackQuery(query.id);
      this.startQuiz(chatId, "normal");
      return true;
    }

    if (data === "quiz_start_reverse") {
      bot.answerCallbackQuery(query.id);
      this.startQuiz(chatId, "reverse");
      return true;
    }

    if (data.startsWith("quiz_")) {
      const parts = data.split("_");
      if (parts.length === 4) {
        const quizChatId = Number(parts[1]);
        const questionIndex = Number(parts[2]);
        const selectedIndex = Number(parts[3]);
        this.handleAnswer(query, quizChatId, questionIndex, selectedIndex);
      }
      return true;
    }

    return false;
  }

  showQuizMenu(chatId) {
    bot.sendMessage(
      chatId,
      "🧠 *Quiz — Test turi tanlang:*\n\n" +
        "🇬🇧 → 🇺🇿 — Inglizcha so'z → O'zbekcha tarjima\n" +
        "🇺🇿 → 🇬🇧 — O'zbekcha so'z → Inglizcha tarjima",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🇬🇧 → 🇺🇿 Inglizdan O'zbekcha",
                callback_data: "quiz_start_normal"
              }
            ],
            [
              {
                text: "🇺🇿 → 🇬🇧 O'zbekdan Inglizcha",
                callback_data: "quiz_start_reverse"
              }
            ]
          ]
        }
      }
    );
  }

  startQuiz(chatId, type = "normal") {
    const questions =
      type === "reverse"
        ? quizService.generateReverseQuiz(5)
        : quizService.generateQuiz(5);

    if (questions.length === 0) {
      return bot.sendMessage(
        chatId,
        "❌ So'zlar yetarli emas (kamida 4 ta kerak).\n" +
          "Avval 📚 So'z o'rganish bo'limidan foydalaning.",
        mainMenuKeyboard
      );
    }

    const quiz = new Quiz(questions);
    this.activeQuizzes.set(chatId, quiz);

    const typeLabel = type === "reverse" ? "🇺🇿 → 🇬🇧" : "🇬🇧 → 🇺🇿";
    bot.sendMessage(
      chatId,
      `🧠 *Quiz boshlandi!* ${typeLabel}\n\n` +
        `📊 ${questions.length} ta savol\n` +
        `Har savolga bitta variant tanlang 👇`,
      { parse_mode: "Markdown" }
    );

    setTimeout(() => this.sendQuestion(chatId), 500);
  }

  sendQuestion(chatId) {
    const quiz = this.activeQuizzes.get(chatId);
    if (!quiz) return;

    if (quiz.isFinished()) {
      this.finishQuiz(chatId);
      return;
    }

    const q = quiz.getCurrentQuestion();
    const num = quiz.currentIndex + 1;
    const total = quiz.questions.length;
    const progressBar =
      "▰".repeat(quiz.currentIndex) + "▱".repeat(total - quiz.currentIndex);

    const text =
      `🧠 *Savol ${num}/${total}*\n${progressBar}\n\n` +
      `📌 *${q.question}*` +
      (q.transcription ? `\n_${q.transcription}_` : "") +
      `\n\nTo'g'ri tarjimasini tanlang:`;

    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...quizOptionsKeyboard(q.options, chatId, quiz.currentIndex)
    });
  }

  handleAnswer(query, chatId, questionIndex, selectedIndex) {
    const quiz = this.activeQuizzes.get(chatId);
    if (!quiz) return;

    if (questionIndex !== quiz.currentIndex) {
      bot.answerCallbackQuery(query.id, { text: "⚠️ Bu savol o'tib ketdi." });
      return;
    }

    const q = quiz.getCurrentQuestion();
    const selected = q.options[selectedIndex];
    const isCorrect = selected === q.correctAnswer;

    if (isCorrect) {
      quiz.score++;
      bot.answerCallbackQuery(query.id, {
        text: "✅ To'g'ri! Zo'r!",
        show_alert: false
      });
    } else {
      bot.answerCallbackQuery(query.id, {
        text: `❌ Noto'g'ri!\n✅ To'g'ri javob: ${q.correctAnswer}`,
        show_alert: true
      });
    }

    quiz.answers.push({ wordId: q.wordId, correct: isCorrect });
    quiz.currentIndex++;

    setTimeout(() => this.sendQuestion(chatId), isCorrect ? 700 : 1500);
  }

  finishQuiz(chatId) {
    const quiz = this.activeQuizzes.get(chatId);
    if (!quiz) return;

    userService.recordQuizResult(chatId, quiz.questions.length, quiz.score);
    this.activeQuizzes.delete(chatId);

    const pct = quiz.getPercentage();
    const emoji = quiz.getResultEmoji();
    const msg = quiz.getResultMessage();

    const wrongAnswers = quiz.answers
      .filter((a) => !a.correct)
      .map((a) => {
        const q = quiz.questions.find((q) => q.wordId === a.wordId);
        return q ? `• _${q.question}_ → *${q.correctAnswer}*` : null;
      })
      .filter(Boolean);

    let text =
      `${emoji} *Quiz tugadi!*\n\n` +
      `📊 Natija: *${quiz.score}/${quiz.questions.length}* (${pct}%)\n\n` +
      `💬 ${msg}`;

    if (wrongAnswers.length > 0) {
      text += `\n\n📖 *Xato javoblar:*\n${wrongAnswers.join("\n")}`;
    }

    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      ...mainMenuKeyboard
    });
  }
}

export default QuizHandler;
