export class Word {
  constructor(data) {
    this.id = data.id;
    this.word = data.word;
    this.translation = data.translation;
    this.transcription = data.transcription || "";
    this.example = data.example || "";
    this.exampleTranslation = data.exampleTranslation || "";
    this.difficulty = data.difficulty || "medium"; // easy | medium | hard
    this.category = data.category || "general";
  }
}
