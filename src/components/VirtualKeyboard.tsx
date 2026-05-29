import { memo, useMemo } from 'react';
import { Box, Button } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import type { TileStatus } from '../types/wordle';
import { tileColors } from '../theme';

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as const;

interface VirtualKeyboardProps {
  letterMap: Map<string, TileStatus>;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled: boolean;
}

function statusToBg(status: TileStatus): string {
  switch (status) {
    case 'correct':
      return tileColors.correct;
    case 'present':
      return tileColors.present;
    case 'absent':
      return tileColors.absent;
    default:
      return '#818384';
  }
}

function VirtualKeyboardComponent({
  letterMap,
  onLetter,
  onEnter,
  onBackspace,
  disabled,
}: VirtualKeyboardProps) {
  const keyWidth = useMemo(() => {
    const base = Math.min(44, Math.floor((window.innerWidth - 32) / 11));
    return Math.max(28, base);
  }, []);

  const renderKey = (letter: string) => {
    const status = letterMap.get(letter) ?? 'empty';
    const bg = statusToBg(status);
    const isKnown =
      status === 'correct' || status === 'present' || status === 'absent';

    return (
      <Button
        key={letter}
        variant="contained"
        disabled={disabled}
        onClick={() => onLetter(letter)}
        aria-label={`Letter ${letter}`}
        sx={{
          minWidth: keyWidth,
          width: keyWidth,
          height: 58,
          p: 0,
          fontSize: '0.95rem',
          fontWeight: 700,
          bgcolor: bg,
          color: '#fff',
          boxShadow: 'none',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: isKnown ? bg : '#6b6d6f',
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            bgcolor: bg,
            color: 'rgba(255,255,255,0.5)',
          },
        }}
      >
        {letter.toUpperCase()}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        maxWidth: 520,
        mx: 'auto',
        mt: 3,
        pb: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.6, justifyContent: 'center' }}>
        {ROWS[0].split('').map(renderKey)}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.6, justifyContent: 'center', pl: 1 }}>
        {ROWS[1].split('').map(renderKey)}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.6, justifyContent: 'center', width: '100%' }}>
        <Button
          variant="contained"
          disabled={disabled}
          onClick={onEnter}
          aria-label="Submit guess"
          sx={{
            minWidth: Math.min(72, keyWidth * 1.6),
            height: 58,
            fontSize: '0.75rem',
            fontWeight: 700,
            bgcolor: '#818384',
            color: '#fff',
            boxShadow: 'none',
            borderRadius: '4px',
            px: 1.5,
            '&:hover': { bgcolor: '#6b6d6f', boxShadow: 'none' },
          }}
        >
          ENTER
        </Button>
        {ROWS[2].split('').map(renderKey)}
        <Button
          variant="contained"
          disabled={disabled}
          onClick={onBackspace}
          aria-label="Delete letter"
          sx={{
            minWidth: Math.min(72, keyWidth * 1.6),
            height: 58,
            bgcolor: '#818384',
            color: '#fff',
            boxShadow: 'none',
            borderRadius: '4px',
            '&:hover': { bgcolor: '#6b6d6f', boxShadow: 'none' },
          }}
        >
          <BackspaceIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}

export const VirtualKeyboard = memo(VirtualKeyboardComponent);
