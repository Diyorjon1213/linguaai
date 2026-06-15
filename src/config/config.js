import "dotenv/config";

const config = {
  botToken: process.env.BOT_TOKEN,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: "gemini-2.5-flash",
  quizQuestionsCount: 5,
  aiMaxTokens: 800,
  channelUsername: "@lingua_ai_uz",
  freeTrialDays: 0
};

if (!config.botToken) {
  console.error("❌ BOT_TOKEN .env faylida topilmadi!");
  process.exit(1);
}
if (!config.geminiApiKey) {
  console.error("❌ GEMINI_API_KEY .env faylida topilmadi!");
  process.exit(1);
}

export default config;
