import { createTheme } from '@mui/material/styles';

export const tileColors = {
  correct: '#538d4e',
  present: '#b59f3b',
  absent: '#3a3a3c',
  empty: 'transparent',
  tbd: 'transparent',
  borderEmpty: '#565758',
  borderFilled: '#818384',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6aaa64' },
    secondary: { main: '#c9b458' },
    background: {
      default: '#121213',
      paper: '#1a1a1b',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d7dadc',
    },
    error: { main: '#ff6b6b' },
    success: { main: '#6aaa64' },
  },
  typography: {
    fontFamily: '"Clear Sans", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.12em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          background:
            'radial-gradient(ellipse at top, #1e1e20 0%, #121213 55%)',
        },
      },
    },
  },
});
