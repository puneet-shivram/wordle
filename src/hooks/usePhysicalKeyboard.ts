import { useEffect } from 'react';

interface PhysicalKeyboardOptions {
  enabled: boolean;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export function usePhysicalKeyboard({
  enabled,
  onLetter,
  onEnter,
  onBackspace,
}: PhysicalKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key;

      if (key === 'Enter') {
        event.preventDefault();
        onEnter();
        return;
      }

      if (key === 'Backspace') {
        event.preventDefault();
        onBackspace();
        return;
      }

      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        onLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onLetter, onEnter, onBackspace]);
}
