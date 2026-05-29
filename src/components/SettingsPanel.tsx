import { memo } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import type { GameConfig } from '../types/wordle';

interface SettingsPanelProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onApply: () => void;
  wordBankSource: string;
  wordCount: number;
  loading: boolean;
}

function SettingsPanelComponent({
  config,
  onConfigChange,
  open,
  onOpen,
  onClose,
  onApply,
  wordBankSource,
  wordCount,
  loading,
}: SettingsPanelProps) {
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon />}
        onClick={onOpen}
        sx={{
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'text.secondary',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        }}
      >
        Settings
      </Button>

      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Game settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box>
              <Typography gutterBottom sx={{ fontWeight: 600 }}>
                Word length: {config.wordLength}
              </Typography>
              <Slider
                value={config.wordLength}
                min={3}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, v) =>
                  onConfigChange({ ...config, wordLength: v as number })
                }
              />
            </Box>
            <Box>
              <Typography gutterBottom sx={{ fontWeight: 600 }}>
                Max attempts: {config.maxAttempts}
              </Typography>
              <Slider
                value={config.maxAttempts}
                min={4}
                max={12}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, v) =>
                  onConfigChange({ ...config, maxAttempts: v as number })
                }
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Word bank
              </Typography>
              <Chip
                size="small"
                label={
                  loading
                    ? 'Loading words…'
                    : `${wordCount.toLocaleString()} words (${wordBankSource})`
                }
                color={wordBankSource === 'remote' ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onApply}>
            New game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const SettingsPanel = memo(SettingsPanelComponent);
