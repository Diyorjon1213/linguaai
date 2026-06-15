export class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.answers = []; // { wordId, correct: bool }
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  isFinished() {
    return this.currentIndex >= this.questions.length;
  }

  getPercentage() {
    return Math.round((this.score / this.questions.length) * 100);
  }

  getResultEmoji() {
    const pct = this.getPercentage();
    if (pct >= 90) return "🏆";
    if (pct >= 70) return "🌟";
    if (pct >= 50) return "👍";
    return "💪";
  }

  getResultMessage() {
    const pct = this.getPercentage();
    if (pct >= 90) return "Ajoyib! Siz zo'rsiz!";
    if (pct >= 70) return "Yaxshi natija! Davom eting!";
    if (pct >= 50) return "Yomon emas! Ko'proq mashq qiling.";
    return "Ko'proq o'qib, yana urinib ko'ring!";
  }
}
