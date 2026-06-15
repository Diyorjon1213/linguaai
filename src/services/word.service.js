import fs from "fs";
import path from "path";
import { Word } from "../models/Word.js";

const WORDS_FILE = path.resolve("src/data/words.json");

class WordService {
  constructor() {
    this._cache = null; // Xotiradagi cache
    this.ensureFileExists();
  }

  ensureFileExists() {
    const dir = path.dirname(WORDS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(WORDS_FILE)) {
      fs.writeFileSync(WORDS_FILE, JSON.stringify([], null, 2));
    }
  }

  // So'zlarni fayl o'zgarsa qayta o'qiydi, aks holda cacheni ishlatadi
  getAllWords() {
    if (!this._cache) {
      try {
        const data = fs.readFileSync(WORDS_FILE, "utf8");
        const raw = JSON.parse(data);
        this._cache = raw.map((w) => new Word(w));
      } catch (error) {
        console.error("So'zlarni o'qishda xatolik:", error.message);
        this._cache = [];
      }
    }
    return this._cache;
  }

  getWordById(id) {
    return this.getAllWords().find((w) => w.id === id) || null;
  }

  // Foydalanuvchi o'rganmagan so'zlardan tasodifiy birini qaytaradi
  getRandomWord(excludeIds = []) {
    const all = this.getAllWords();
    const available = all.filter((w) => !excludeIds.includes(w.id));

    if (available.length === 0) {
      // Hammasi o'rganilgan — barcha so'zlardan biri
      if (all.length === 0) return null;
      return all[Math.floor(Math.random() * all.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  // Tasodifiy N ta so'z (quiz uchun)
  getRandomWords(count = 5) {
    const all = this.getAllWords();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, all.length));
  }

  getTotalCount() {
    return this.getAllWords().length;
  }
}

export default new WordService();
