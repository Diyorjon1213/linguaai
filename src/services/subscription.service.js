import bot from "../bot/bot.js";
import config from "../config/config.js";

class SubscriptionService {
  // Foydalanuvchi kanalga obuna bo'lganini tekshiradi
  async isSubscribed(chatId) {
    try {
      const member = await bot.getChatMember(config.channelUsername, chatId);
      return ["member", "administrator", "creator"].includes(member.status);
    } catch {
      return false;
    }
  }

  // Foydalanuvchi sinov muddati tugaganini tekshiradi
  isTrialExpired(user) {
    if (!user.createdAt) return false;
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays >= config.freeTrialDays;
  }

  // Obuna talab qilish xabarini yuboradi
  sendSubscribeMessage(chatId) {
    bot.sendMessage(
      chatId,
      "🔒 *Botdan foydalanish uchun kanalga obuna bo'ling!*\n\n" +
        `Siz ${config.freeTrialDays} kunlik bepul sinov muddatidan foydalandingiz.\n\n` +
        `✅ Kanalga obuna bo'lgach — bot to'liq ochiladi!`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📢 Kanalga o'tish",
                url: `https://t.me/${config.channelUsername.replace("@", "")}`
              }
            ],
            [{ text: "✅ Obuna bo'ldim", callback_data: "check_subscription" }]
          ]
        }
      }
    );
  }
}

export default new SubscriptionService();
