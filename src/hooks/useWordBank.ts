import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  WORD_BANK_URL,
  getFallbackWords,
  parseWordList,
} from '../utils/wordBank';

interface WordBankState {
  words: string[];
  loading: boolean;
  error: string | null;
  source: 'remote' | 'fallback';
}

const cache = new Map<number, string[]>();

export function useWordBank(wordLength: number) {
  const [state, setState] = useState<WordBankState>({
    words: cache.get(wordLength) ?? [],
    loading: !cache.has(wordLength),
    error: null,
    source: cache.has(wordLength) ? 'remote' : 'fallback',
  });
  const abortRef = useRef<AbortController | null>(null);

  const loadWords = useCallback(async (length: number) => {
    if (cache.has(length)) {
      setState({
        words: cache.get(length)!,
        loading: false,
        error: null,
        source: 'remote',
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(WORD_BANK_URL, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const parsed = parseWordList(text, length);

      if (parsed.length < 50) {
        throw new Error('Not enough words for this length');
      }

      cache.set(length, parsed);
      setState({
        words: parsed,
        loading: false,
        error: null,
        source: 'remote',
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const fallback = getFallbackWords(length);
      cache.set(length, fallback);
      setState({
        words: fallback,
        loading: false,
        error:
          err instanceof Error ? err.message : 'Failed to load word bank',
        source: 'fallback',
      });
    }
  }, []);

  useEffect(() => {
    loadWords(wordLength);
    return () => abortRef.current?.abort();
  }, [wordLength, loadWords]);

  const wordSet = useMemo(
    () => new Set(state.words.map((w) => w.toLowerCase())),
    [state.words],
  );

  const isValidWord = useCallback(
    (word: string) => wordSet.has(word.toLowerCase()),
    [wordSet],
  );

  return { ...state, wordSet, isValidWord, reload: () => loadWords(wordLength) };
}
