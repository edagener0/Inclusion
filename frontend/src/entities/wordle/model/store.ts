import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { LetterStatus } from '../lib/parse-diff';

type WordleState = {
  gameId: number | null;
  guesses: string[];
  results: LetterStatus[][];
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
  addGuess: (guess: string, result: LetterStatus[]) => void;
  reset: (gameId: number) => void;
};

export const useWordleStore = create<WordleState>()(
  persist(
    (set) => ({
      gameId: null,
      guesses: [],
      results: [],
      currentGuess: '',
      isGameOver: false,
      setCurrentGuess: (guess) => set({ currentGuess: guess }),
      addGuess: (guess, result) =>
        set((state) => ({
          guesses: [...state.guesses, guess],
          results: [...state.results, result],
          currentGuess: '',
        })),
      reset: (gameId) =>
        set({
          gameId,
          guesses: [],
          results: [],
          currentGuess: '',
        }),
    }),
    { name: 'wordle-state' },
  ),
);

export const selectUsedLetters = (state: WordleState) => {
  return state.results.reduce(
    (acc, row, rowIndex) => {
      const word = state.guesses[rowIndex];
      if (!word) return acc;

      row.forEach((status, i) => {
        const letter = word[i]?.toUpperCase();
        if (!letter) return;

        if (status === 'correct') {
          acc[letter] = 'correct';
        } else if (status === 'present' && acc[letter] !== 'correct') {
          acc[letter] = 'present';
        } else if (status === 'absent' && !acc[letter]) {
          acc[letter] = 'absent';
        }
      });
      return acc;
    },
    {} as Record<string, LetterStatus>,
  );
};
