import { memo } from 'react';
import { Box, keyframes } from '@mui/material';
import type { TileStatus } from '../types/wordle';
import { tileColors } from '../theme';

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const flip = keyframes`
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg); }
`;

interface TileProps {
  letter: string;
  status: TileStatus;
  size: number;
  animateReveal?: boolean;
  revealDelay?: number;
}

function getTileStyles(status: TileStatus, hasLetter: boolean) {
  const background =
    status === 'correct' || status === 'present' || status === 'absent'
      ? tileColors[status]
      : 'transparent';

  const borderColor =
    status === 'empty' || status === 'tbd'
      ? hasLetter
        ? tileColors.borderFilled
        : tileColors.borderEmpty
      : background;

  const color =
    status === 'correct' || status === 'present' || status === 'absent'
      ? '#fff'
      : '#ffffff';

  return {
    backgroundColor: background,
    border: `2px solid ${borderColor}`,
    color,
  };
}

function TileComponent({
  letter,
  status,
  size,
  animateReveal = false,
  revealDelay = 0,
}: TileProps) {
  const hasLetter = letter.length > 0;
  const styles = getTileStyles(status, hasLetter);
  const isRevealed =
    status === 'correct' || status === 'present' || status === 'absent';

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.52,
        fontWeight: 700,
        textTransform: 'uppercase',
        borderRadius: '4px',
        userSelect: 'none',
        perspective: '600px',
        ...styles,
        ...(hasLetter &&
          status === 'tbd' && {
            animation: `${pop} 0.1s ease`,
          }),
        ...(animateReveal &&
          isRevealed && {
            animation: `${flip} 0.5s ease ${revealDelay}ms both`,
            animationFillMode: 'backwards',
          }),
      }}
    >
      {letter}
    </Box>
  );
}

export const Tile = memo(TileComponent);
