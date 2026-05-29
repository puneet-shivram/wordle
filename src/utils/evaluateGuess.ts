import type { TileStatus } from '../types/wordle';

export function evaluateGuess(guess: string, target: string): TileStatus[] {
  const len = target.length;
  const result: TileStatus[] = Array(len).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');
  const consumed = Array(len).fill(false);

  for (let i = 0; i < len; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
      consumed[i] = true;
    }
  }

  for (let i = 0; i < len; i++) {
    if (result[i] === 'correct') continue;
    const letter = guessChars[i];
    const matchIndex = targetChars.findIndex(
      (ch, j) => ch === letter && !consumed[j],
    );
    if (matchIndex !== -1) {
      result[i] = 'present';
      consumed[matchIndex] = true;
    }
  }

  return result;
}

const STATUS_RANK: Record<TileStatus, number> = {
  empty: 0,
  tbd: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function mergeLetterStatus(
  current: TileStatus,
  incoming: TileStatus,
): TileStatus {
  return STATUS_RANK[incoming] > STATUS_RANK[current] ? incoming : current;
}
