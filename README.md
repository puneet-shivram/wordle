# Wordle

A customizable Wordle clone built with React, TypeScript, and Material UI.

## Features

- Configurable **word length** (3–10) and **max attempts** (4–12)
- Word bank loaded from [dwyl/english-words](https://github.com/dwyl/english-words) on GitHub
- Classic tile colors: green (correct spot), gold (wrong spot), gray (not in word)
- On-screen QWERTY keyboard plus physical keyboard (A–Z, Enter, Backspace)
- Confetti celebration on win
- Optimized with `useMemo`, `useCallback`, and `memo`

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```
