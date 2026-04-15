import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type LetterStatus } from '@/entities/wordle';

interface WordleState {
  guesses: string[];
  results: LetterStatus[][];
  currentGuess: string;
  isGameOver: boolean;
  setCurrentGuess: (guess: string) => void;
  addGuess: (guess: string, result: LetterStatus[]) => void;
  setGameOver: (over: boolean) => void;
  reset: () => void;
}

export const createWordleStore = (storageKey: string) =>
  create<WordleState>()(
    persist(
      (set) => ({
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
        setGameOver: (over) => set({ isGameOver: over }),
        reset: () =>
          set({
            guesses: [],
            results: [],
            currentGuess: '',
            isGameOver: false,
          }),
      }),
      {
        name: storageKey,
      }
    )
  );