export class User {
  constructor(chatId, firstName = "") {
    this.chatId = chatId;
    this.firstName = firstName;
    this.learnedWords = [];     // O'rganilgan so'z ID'lari
    this.learningWords = [];    // Hozir o'rganayotgan so'zlar
    this.stats = {
      totalLearned: 0,          // Jami o'rganilgan so'zlar
      totalQuizzes: 0,          // Jami o'ynalgan quizlar
      totalCorrect: 0,          // Jami to'g'ri javoblar
      currentStreak: 0,         // Ketma-ket kunlar
      lastStudyDate: null,      // Oxirgi mashq sanasi
    };
    this.aiHistory = [];        // AI suhbat tarixi (oxirgi 10 ta xabar)
    this.createdAt = new Date().toISOString();
  }
}
