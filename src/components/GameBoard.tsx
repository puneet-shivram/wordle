import { memo, useMemo } from 'react';
import { Box, keyframes } from '@mui/material';
import type { TileStatus } from '../types/wordle';
import { Tile } from './Tile';

const shakeAnim = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

interface BoardRow {
  letters: string[];
  statuses: TileStatus[];
}

interface GameBoardProps {
  rows: BoardRow[];
  wordLength: number;
  shakeRowIndex: number | null;
  shake: boolean;
}

function GameBoardComponent({
  rows,
  wordLength,
  shakeRowIndex,
  shake,
}: GameBoardProps) {
  const tileSize = useMemo(() => {
    const maxWidth = Math.min(480, window.innerWidth - 48);
    const gap = 6;
    return Math.min(62, Math.floor((maxWidth - gap * (wordLength - 1)) / wordLength));
  }, [wordLength]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
        maxWidth: 520,
        mx: 'auto',
      }}
    >
      {rows.map((row, rowIndex) => {
        const paddedLetters = [...row.letters];
        while (paddedLetters.length < wordLength) paddedLetters.push('');

        const isShaking = shake && shakeRowIndex === rowIndex;

        return (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              gap: '6px',
              ...(isShaking && { animation: `${shakeAnim} 0.45s ease` }),
            }}
          >
            {paddedLetters.map((letter, colIndex) => {
              const status = row.statuses[colIndex] ?? 'empty';
              const isSubmitted =
                status === 'correct' ||
                status === 'present' ||
                status === 'absent';

              return (
                <Tile
                  key={colIndex}
                  letter={letter}
                  status={status}
                  size={tileSize}
                  animateReveal={isSubmitted}
                  revealDelay={colIndex * 300}
                />
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}

export const GameBoard = memo(GameBoardComponent);
