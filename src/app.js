import "./config/config.js";

import bot from "./bot/bot.js";
import subscriptionService from "./services/subscription.service.js";
import checkSubscription from "./middleware/subscription.middleware.js";

// bot.onText ni obuna himoyasi bilan o'raymiz.
// Bu qator pastdagi barcha handler.handle() chaqiruvlaridan OLDIN bo'lishi shart.
const originalOnText = bot.onText.bind(bot);
bot.onText = function (regex, callback) {
  // /start har doim ishlaydi - obuna tekshirilmaydi
  if (regex.source.includes("start")) {
    return originalOnText(regex, callback);
  }

  return originalOnText(regex, async (msg, match) => {
    const chatId = msg.chat.id;
    const allowed = await checkSubscription(chatId);
    if (!allowed) {
      subscriptionService.sendSubscribeMessage(chatId);
      return;
    }
    callback(msg, match);
  });
};

import StartHandler from "./handlers/start.handler.js";
import MenuHandler from "./handlers/menu.handler.js";
import FlashcardHandler from "./handlers/flashcard.handler.js";
import QuizHandler from "./handlers/quiz.handler.js";
import AiHandler from "./handlers/ai.handler.js";

const startHandler = new StartHandler();
const menuHandler = new MenuHandler();
const flashcardHandler = new FlashcardHandler();
const quizHandler = new QuizHandler();
const aiHandler = new AiHandler();

startHandler.handle();
menuHandler.handle();
flashcardHandler.handle();
quizHandler.handle();
aiHandler.handle();

// Markaziy callback dispatcher
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "check_subscription") {
    const subscribed = await subscriptionService.isSubscribed(chatId);
    if (subscribed) {
      bot.answerCallbackQuery(query.id, { text: "✅ Rahmat! Bot endi ochiq." });
      bot.sendMessage(
        chatId,
        "🎉 Kanalga obuna bo'ldingiz! Botdan to'liq foydalanishingiz mumkin.",
        { reply_markup: { remove_keyboard: true } }
      );
      menuHandler.showMainMenu(chatId);
    } else {
      bot.answerCallbackQuery(query.id, {
        text: "❌ Siz hali obuna bo'lmagansiz!",
        show_alert: true
      });
    }
    return;
  }

  const allowed = await checkSubscription(chatId);
  if (!allowed) {
    bot.answerCallbackQuery(query.id);
    subscriptionService.sendSubscribeMessage(chatId);
    return;
  }

  const handled =
    (await flashcardHandler.handleCallback(query)) ||
    menuHandler.handleCallback(query) ||
    quizHandler.handleCallback(query);

  if (!handled) {
    bot.answerCallbackQuery(query.id).catch(() => {});
  }
});

console.log("🚀 LinguaAI Bot muvaffaqiyatli ishga tushdi!");
console.log("📌 Botni to'xtatish uchun Ctrl+C bosing.");
