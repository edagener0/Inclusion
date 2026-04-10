import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSession } from '@/entities/session';
import {
  type LetterStatus,
  WORDLE_CONFIG,
  parseDiff,
  submitGuess,
  wordleQueries,
} from '@/entities/wordle';

export function useWordleGame() {
  const queryClient = useQueryClient();
  const user = useSession();

  const { data: wordMetadata, isLoading: isLoadingWord } = useQuery(wordleQueries.word());

  const storageKey = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return `wordle_game_${user.id}_${today}`;
  }, [user.id]);

  type WordleGameState = {
    guesses: string[];
    results: LetterStatus[][];
    currentGuess: string;
    isGameOver: boolean;
  };

  const getDefaultGameState = (): WordleGameState => ({
    guesses: [] as string[],
    results: [] as LetterStatus[][],
    currentGuess: '',
    isGameOver: false,
  });

  const loadGameState = (): WordleGameState => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as WordleGameState) : getDefaultGameState();
    } catch {
      return getDefaultGameState();
    }
  };

  const saveGameState = useCallback(
    (state: WordleGameState) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Silently fail if localStorage is unavailable
      }
    },
    [storageKey],
  );

  const [guesses, setGuesses] = useState<string[]>(() => loadGameState().guesses);
  const [results, setResults] = useState<LetterStatus[][]>(() => loadGameState().results);
  const [currentGuess, setCurrentGuess] = useState<string>(() => loadGameState().currentGuess);
  const [isGameOver, setIsGameOver] = useState<boolean>(() => loadGameState().isGameOver);

  const wordLength = wordMetadata?.length || 5;
  const maxTries = WORDLE_CONFIG.MAX_TRIES;

  useEffect(() => {
    saveGameState({
      guesses,
      results,
      currentGuess,
      isGameOver,
    });
  }, [guesses, results, currentGuess, isGameOver, saveGameState]);

  const { mutate: guess, isPending: isSubmitting } = useMutation({
    mutationFn: submitGuess,
    onSuccess: (data) => {
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      const newResult = parseDiff(data.diff);
      setResults([...results, newResult]);
      setCurrentGuess('');

      if (data.correct) {
        setIsGameOver(true);
        toast.success('Incrível! Acertaste na palavra!');
        queryClient.invalidateQueries({ queryKey: wordleQueries.leaderboard().queryKey });
      } else if (newGuesses.length >= maxTries) {
        setIsGameOver(true);
        toast.error('Game Over! Esgotaste as tuas tentativas.');
      }
    },
    onError: (error: unknown) => {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        toast.error(apiError.response?.data?.detail || 'Erro ao submeter palpite.');
      } else {
        toast.error('Erro ao submeter palpite.');
      }
    },
  });

  const onKeyPress = useCallback(
    (key: string) => {
      if (isGameOver || isSubmitting) return;

      const upperKey = key.toUpperCase();

      if (upperKey === 'ENTER') {
        if (currentGuess.length !== wordLength) {
          toast.warning(`A palavra deve ter ${wordLength} letras`);
          return;
        }
        guess(currentGuess);
      } else if (upperKey === 'DELETE' || upperKey === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(upperKey)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess((prev) => (prev + upperKey).toLowerCase());
        }
      }
    },
    [currentGuess, wordLength, isGameOver, isSubmitting, guess],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      onKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  const usedLetters = results.reduce(
    (acc, row, rowIndex) => {
      const word = guesses[rowIndex];
      row.forEach((status, i) => {
        const letter = word[i].toUpperCase();
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

  return {
    guesses,
    results,
    currentGuess,
    wordLength,
    maxTries,
    isLoading: isLoadingWord,
    isSubmitting,
    isGameOver,
    usedLetters,
    onKeyPress,
  };
}
