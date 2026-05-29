import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Celebration } from './components/Celebration';
import { GameBoard } from './components/GameBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { usePhysicalKeyboard } from './hooks/usePhysicalKeyboard';
import { useWordBank } from './hooks/useWordBank';
import { useWordleGame } from './hooks/useWordleGame';
import { theme } from './theme';
import type { GameConfig } from './types/wordle';

const DEFAULT_CONFIG: GameConfig = {
  wordLength: 5,
  maxAttempts: 6,
};

function App() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [draftConfig, setDraftConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameEpoch, setGameEpoch] = useState(0);

  const { words, loading, error, source, isValidWord } = useWordBank(
    config.wordLength,
  );

  const ready = !loading && words.length > 0;

  const game = useWordleGame({
    config,
    words,
    isValidWord,
    ready,
    resetKey: gameEpoch,
  });

  const handleNewGame = useCallback(() => {
    setGameEpoch((n) => n + 1);
  }, []);

  const handleApplySettings = useCallback(() => {
    setConfig(draftConfig);
    setSettingsOpen(false);
    setGameEpoch((n) => n + 1);
  }, [draftConfig]);

  const keyboardEnabled = game.status === 'playing' && ready;

  usePhysicalKeyboard({
    enabled: keyboardEnabled,
    onLetter: game.addLetter,
    onEnter: game.submitGuess,
    onBackspace: game.removeLetter,
  });

  const shakeRowIndex = useMemo(
    () => (game.shakeRow ? game.currentRowIndex : null),
    [game.shakeRow, game.currentRowIndex],
  );

  const showEndDialog = game.status === 'won' || game.status === 'lost';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Celebration active={game.status === 'won'} />

      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 560, mx: 'auto', width: '100%' }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
            WORDLE
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <SettingsPanel
              config={draftConfig}
              onConfigChange={setDraftConfig}
              open={settingsOpen}
              onOpen={() => {
                setDraftConfig(config);
                setSettingsOpen(true);
              }}
              onClose={() => setSettingsOpen(false)}
              onApply={handleApplySettings}
              wordBankSource={source}
              wordCount={words.length}
              loading={loading}
            />
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleNewGame}
              disabled={!ready}
              sx={{ color: 'text.secondary' }}
            >
              New
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Using offline fallback words. ({error})
          </Alert>
        )}

        {ready && (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Guess the {config.wordLength}-letter word in {config.maxAttempts} tries
              </Typography>
            </Box>

            <GameBoard
              rows={game.board}
              wordLength={config.wordLength}
              shakeRowIndex={shakeRowIndex}
              shake={game.shakeRow}
            />

            <VirtualKeyboard
              letterMap={game.letterKeyboardMap}
              onLetter={game.addLetter}
              onEnter={game.submitGuess}
              onBackspace={game.removeLetter}
              disabled={!keyboardEnabled}
            />

            {showEndDialog && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor:
                    game.status === 'won' ? 'success.main' : 'error.main',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  {game.status === 'won' ? '🎉 You won!' : 'Game over'}
                </Typography>
                {game.status === 'lost' && (
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    The word was{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {game.targetWord.toUpperCase()}
                    </Box>
                  </Typography>
                )}
                <Button variant="contained" onClick={handleNewGame}>
                  Play again
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={Boolean(game.message)}
        autoHideDuration={2500}
        onClose={() => game.setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={
          game.message ? (
            <Alert
              severity={
                game.message.type === 'error'
                  ? 'error'
                  : game.message.type === 'success'
                    ? 'success'
                    : 'info'
              }
              variant="filled"
              sx={{ width: '100%' }}
            >
              {game.message.text}
            </Alert>
          ) : undefined
        }
      />
    </ThemeProvider>
  );
}

export default App;
