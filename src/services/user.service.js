import fs from "fs";
import path from "path";
import { User } from "../models/User.js";

const USERS_FILE = path.resolve("src/data/users.json");

class UserService {
  constructor() {
    this.ensureFileExists();
  }

  ensureFileExists() {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
  }

  _readAll() {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      return data.trim() ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  _writeAll(users) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error("Foydalanuvchilarni saqlashda xatolik:", error.message);
    }
  }

  // Foydalanuvchini olish yoki yangi yaratish
  getUser(chatId, firstName = "") {
    const users = this._readAll();
    let user = users.find((u) => u.chatId === chatId);

    if (!user) {
      user = new User(chatId, firstName);
      users.push(user);
      this._writeAll(users);
      console.log(`🆕 Yangi foydalanuvchi: ${chatId} (${firstName})`);
    }

    return user;
  }

  updateUser(chatId, updates) {
    const users = this._readAll();
    const index = users.findIndex((u) => u.chatId === chatId);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    this._writeAll(users);
    return users[index];
  }

  // So'z o'rganiganida chaqiriladi
  markWordLearned(chatId, wordId) {
    const user = this.getUser(chatId);

    if (!user.learnedWords.includes(wordId)) {
      user.learnedWords.push(wordId);
      user.stats.totalLearned += 1;
    }

    // Streak yangilash
    user.stats = this._updateStreak(user.stats);
    this.updateUser(chatId, {
      learnedWords: user.learnedWords,
      stats: user.stats
    });
  }

  // Quiz tugaganda chaqiriladi
  recordQuizResult(chatId, totalQuestions, correctAnswers) {
    const user = this.getUser(chatId);
    user.stats.totalQuizzes += 1;
    user.stats.totalCorrect += correctAnswers;
    user.stats = this._updateStreak(user.stats);

    this.updateUser(chatId, { stats: user.stats });
  }

  _updateStreak(stats) {
    const today = new Date().toDateString();
    const lastDate = stats.lastStudyDate
      ? new Date(stats.lastStudyDate).toDateString()
      : null;

    if (lastDate === today) {
      // Bugun allaqachon mashq qilgan — streak o'zgarmaydi
      return stats;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      stats.currentStreak += 1; // Ketma-ket kun
    } else {
      stats.currentStreak = 1; // Streak uzildi, qayta boshlash
    }

    stats.lastStudyDate = new Date().toISOString();
    return stats;
  }
}

export default new UserService();
