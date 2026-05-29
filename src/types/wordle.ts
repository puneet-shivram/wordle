export type TileStatus = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type LetterKeyStatus = 'unused' | 'correct' | 'present' | 'absent';

export interface GameConfig {
  wordLength: number;
  maxAttempts: number;
}

export interface GuessRow {
  word: string;
  evaluation: TileStatus[];
}
