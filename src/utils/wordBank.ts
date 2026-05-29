/** Public English word list (MIT) — filtered client-side by word length. */
export const WORD_BANK_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';

const FALLBACK_BY_LENGTH: Record<number, string[]> = {
  4: ['able', 'back', 'cake', 'dawn', 'each', 'face', 'game', 'hand'],
  5: ['apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'grape', 'house'],
  6: ['planet', 'silver', 'garden', 'bridge', 'castle', 'dragon', 'forest'],
  7: ['pattern', 'crystal', 'harmony', 'journey', 'kingdom', 'mystery'],
  8: ['mountain', 'sunlight', 'treasure', 'umbrella', 'vacation'],
};

export function getFallbackWords(length: number): string[] {
  if (FALLBACK_BY_LENGTH[length]) return FALLBACK_BY_LENGTH[length];
  const base = FALLBACK_BY_LENGTH[5];
  return base.map((w) => w.slice(0, length).padEnd(length, 'a'));
}

export function parseWordList(text: string, wordLength: number): string[] {
  return text
    .split('\n')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length === wordLength && /^[a-z]+$/.test(w));
}

export function pickRandomWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}
