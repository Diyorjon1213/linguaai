import wordService from "./word.service.js";

class QuizService {
  // N ta savol yaratadi — inglizcha so'z → o'zbekcha tarjimani topish
  generateQuiz(count = 5) {
    const all = wordService.getAllWords();
    if (all.length < 4) return []; // Kamida 4 ta so'z kerak (1 to'g'ri + 3 noto'g'ri)

    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, all.length));

    return selected.map((word) => {
      const wrong = all
        .filter((w) => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.translation);

      const options = [...wrong, word.translation].sort(
        () => Math.random() - 0.5
      );

      return {
        wordId: word.id,
        question: word.word,
        transcription: word.transcription,
        options,
        correctAnswer: word.translation,
      };
    });
  }

  // Teskari quiz: o'zbekcha → inglizcha
  generateReverseQuiz(count = 5) {
    const all = wordService.getAllWords();
    if (all.length < 4) return [];

    const shuffled = [...all].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, all.length));

    return selected.map((word) => {
      const wrong = all
        .filter((w) => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.word);

      const options = [...wrong, word.word].sort(() => Math.random() - 0.5);

      return {
        wordId: word.id,
        question: word.translation,
        transcription: null,
        options,
        correctAnswer: word.word,
      };
    });
  }
}

export default new QuizService();
