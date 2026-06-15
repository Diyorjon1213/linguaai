// Asosiy menyu klaviaturasi
export const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [
      ["📚 So'z o'rganish", "🧠 Quiz / Test"],
      ["🤖 AI bilan suhbat", "📊 Mening natijalarim"],
      ["ℹ️ Yordam"]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// Flashcard tugmalari
export function flashcardKeyboard(wordId) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Bilaman", callback_data: `know_${wordId}` },
          { text: "❓ Bilmayman", callback_data: `dontknow_${wordId}` }
        ],
        [{ text: "🔄 Boshqa so'z", callback_data: "new_word" }],
        [{ text: "🏠 Asosiy menyu", callback_data: "main_menu" }]
      ]
    }
  };
}

// Quiz variantlari tugmalari
export function quizOptionsKeyboard(options, chatId, questionIndex) {
  return {
    reply_markup: {
      inline_keyboard: options.map((option, index) => [
        {
          text: option,
          callback_data: `quiz_${chatId}_${questionIndex}_${index}`
        }
      ])
    }
  };
}

// AI suhbat menyusi
export const aiMenuKeyboard = {
  reply_markup: {
    keyboard: [["🏠 Asosiy menyuga qaytish"]],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};
