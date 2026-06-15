import TelegramBot from "node-telegram-bot-api";
import config from "../config/config.js";

const bot = new TelegramBot(config.botToken, {
  polling: true,
  polling_interval: 300
});

bot.on("polling_error", (error) => {
  console.error("Polling xatosi:", error.message);
});

export default bot;
