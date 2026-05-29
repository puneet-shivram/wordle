import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameConfig, GameStatus, GuessRow, TileStatus } from '../types/wordle';
import { evaluateGuess, mergeLetterStatus } from '../utils/evaluateGuess';
import { pickRandomWord } from '../utils/wordBank';

export type MessageType = 'info' | 'error' | 'success';

export interface GameMessage {
  text: string;
  type: MessageType;
}

interface UseWordleGameOptions {
  config: GameConfig;
  words: string[];
  isValidWord: (word: string) => boolean;
  ready: boolean;
  resetKey: number;
}

export function useWordleGame({
  config,
  words,
  isValidWord,
  ready,
  resetKey,
}: UseWordleGameOptions) {
  const { wordLength, maxAttempts } = config;

  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [message, setMessage] = useState<GameMessage | null>(null);
  const [shakeRow, setShakeRow] = useState(false);

  const startNewGame = useCallback(() => {
    if (!words.length) return;
    setTargetWord(pickRandomWord(words));
    setGuesses([]);
    setCurrentGuess('');
    setStatus('playing');
    setMessage(null);
    setShakeRow(false);
  }, [words]);

  useEffect(() => {
    if (ready && words.length) {
      startNewGame();
    }
  }, [ready, words, resetKey, startNewGame]);

  const currentRowIndex = guesses.length;

  const board = useMemo(() => {
    const rows: Array<{ letters: string[]; statuses: TileStatus[] }> = [];

    for (let i = 0; i < maxAttempts; i++) {
      if (i < guesses.length) {
        const g = guesses[i];
        rows.push({
          letters: g.word.split(''),
          statuses: g.evaluation,
        });
      } else if (i === currentRowIndex && status === 'playing') {
        const letters = currentGuess.split('');
        const statuses: TileStatus[] = Array(wordLength).fill('empty');
        for (let j = 0; j < wordLength; j++) {
          statuses[j] = letters[j] ? 'tbd' : 'empty';
        }
        rows.push({ letters, statuses });
      } else {
        rows.push({
          letters: Array(wordLength).fill(''),
          statuses: Array(wordLength).fill('empty'),
        });
      }
    }
    return rows;
  }, [guesses, currentGuess, maxAttempts, wordLength, currentRowIndex, status]);

  const letterKeyboardMap = useMemo(() => {
    const map = new Map<string, TileStatus>();
    for (const guess of guesses) {
      guess.word.split('').forEach((letter, i) => {
        const prev = map.get(letter) ?? 'empty';
        map.set(letter, mergeLetterStatus(prev, guess.evaluation[i]));
      });
    }
    return map;
  }, [guesses]);

  const showMessage = useCallback((text: string, type: MessageType) => {
    setMessage({ text, type });
  }, []);

  const triggerShake = useCallback(() => {
    setShakeRow(true);
    window.setTimeout(() => setShakeRow(false), 500);
  }, []);

  const submitGuess = useCallback(() => {
    if (status !== 'playing') return;

    if (currentGuess.length !== wordLength) {
      showMessage(`Word must be ${wordLength} letters`, 'error');
      triggerShake();
      return;
    }

    if (!isValidWord(currentGuess)) {
      showMessage('Not in word list', 'error');
      triggerShake();
      return;
    }

    const evaluation = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, { word: currentGuess, evaluation }];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setMessage(null);

    if (currentGuess === targetWord) {
      setStatus('won');
      showMessage('Excellent!', 'success');
      return;
    }

    if (newGuesses.length >= maxAttempts) {
      setStatus('lost');
      showMessage(`The word was ${targetWord.toUpperCase()}`, 'info');
    }
  }, [
    status,
    currentGuess,
    wordLength,
    isValidWord,
    targetWord,
    guesses,
    maxAttempts,
    showMessage,
    triggerShake,
  ]);

  const addLetter = useCallback(
    (letter: string) => {
      if (status !== 'playing') return;
      const key = letter.toLowerCase();
      if (!/^[a-z]$/.test(key)) return;
      if (currentGuess.length >= wordLength) return;
      setCurrentGuess((prev) => prev + key);
      setMessage(null);
    },
    [status, currentGuess.length, wordLength],
  );

  const removeLetter = useCallback(() => {
    if (status !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
    setMessage(null);
  }, [status]);

  return {
    targetWord,
    guesses,
    currentGuess,
    status,
    message,
    board,
    letterKeyboardMap,
    shakeRow,
    currentRowIndex,
    startNewGame,
    submitGuess,
    addLetter,
    removeLetter,
    setMessage,
  };
}
