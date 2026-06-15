# 🤖 LinguaAI Bot

Telegram orqali ingliz tili o'qituvchi bot — so'z o'rganish, quiz va AI suhbat.

## 📁 Loyiha tuzilishi

```
src/
├── app.js                  — Asosiy entry point
├── bot/
│   └── bot.js              — Telegram bot instance
├── config/
│   └── config.js           — Konfiguratsiya va env tekshirish
├── data/
│   ├── words.json          — So'zlar bazasi
│   └── users.json          — Foydalanuvchilar (auto-created)
├── handlers/
│   ├── start.handler.js    — /start buyrug'i
│   ├── menu.handler.js     — Menyu va statistika
│   ├── flashcard.handler.js— So'z o'rganish
│   ├── quiz.handler.js     — Quiz / Test
│   └── ai.handler.js       — AI suhbat
├── models/
│   ├── User.js             — Foydalanuvchi modeli
│   ├── Word.js             — So'z modeli
│   └── Quiz.js             — Quiz modeli
├── services/
│   ├── user.service.js     — Foydalanuvchilar bilan ishlash
│   ├── word.service.js     — So'zlar bilan ishlash
│   ├── quiz.service.js     — Quiz generatsiya
│   └── ai.service.js       — Gemini AI integratsiya
└── utils/
    └── keyboard.js         — Telegram klaviaturalari
```

## 🚀 O'rnatish

### 1. Repo klonlash va paketlarni o'rnatish
```bash
npm install
```

### 2. `.env` fayl yaratish
```bash
cp .env.example .env
```

`.env` faylini oching va kalitlarni kiriting:
```
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

> **Bot token** — [@BotFather](https://t.me/BotFather) dan olinadi  
> **Gemini API key** — [Google AI Studio](https://aistudio.google.com) dan olinadi

### 3. Botni ishga tushirish
```bash
# Oddiy ishga tushirish
npm start

# Development (auto-restart)
npm run dev
```

## ✨ Imkoniyatlar

| Bo'lim | Tavsif |
|--------|--------|
| 📚 So'z o'rganish | Flashcard usulida so'zlarni o'rganing |
| 🧠 Quiz / Test | 2 xil quiz: 🇬🇧→🇺🇿 va 🇺🇿→🇬🇧 |
| 🤖 AI suhbat | Gemini AI bilan inglizcha mashq qiling (xotira bilan) |
| 📊 Natijalar | Progress bar, streak, quiz aniqlik ko'rsatiladi |

## 📝 So'z qo'shish

`src/data/words.json` faylini tahrirlang:

```json
{
  "id": 21,
  "word": "ambitious",
  "translation": "maqsadli, intiluvchi",
  "transcription": "/æmˈbɪʃəs/",
  "example": "She is very ambitious about her career.",
  "exampleTranslation": "U karerasi haqida juda maqsadli.",
  "difficulty": "easy",
  "category": "personality"
}
```

**difficulty**: `easy` | `medium` | `hard`  
**category**: `emotion` | `personality` | `time` | `business` | `general` va h.k.
