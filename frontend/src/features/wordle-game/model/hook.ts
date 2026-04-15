import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

import { createWordleStore } from './store';

export function useWordleGame() {
  const queryClient = useQueryClient();
  const user = useSession();
  const { t } = useTranslation('games', { keyPrefix: 'hook' });

  const { data: wordMetadata, isLoading: isLoadingWord } = useQuery(wordleQueries.word());

  const storageKey = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return `wordle_game_${user.id}_${today}`;
  }, [user.id]);

  const useWordleStore = useMemo(() => createWordleStore(storageKey), [storageKey]);

  const { guesses, results, currentGuess, isGameOver, setCurrentGuess, addGuess, setGameOver } =
    useWordleStore();

  const wordLength = wordMetadata?.length || 5;
  const maxTries = WORDLE_CONFIG.MAX_TRIES;

  const { mutate: guess, isPending: isSubmitting } = useMutation({
    mutationFn: submitGuess,
    onSuccess: (data) => {
      addGuess(currentGuess, parseDiff(data.diff));

      if (data.correct) {
        setGameOver(true);
        toast.success(t('winMessage'));
        queryClient.invalidateQueries({ queryKey: wordleQueries.leaderboard().queryKey });
      } else if (guesses.length + 1 >= maxTries) {
        setGameOver(true);
        toast.error(t('loseMessage'));
      }
    },
    onError: (error: unknown) => {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as { response?: { data?: { detail?: string } } };
        toast.error(apiError.response?.data?.detail || t('error'));
      } else {
        toast.error(t('error'));
      }
    },
  });

  const onKeyPress = useCallback(
    (key: string) => {
      if (isGameOver || isSubmitting) return;

      const upperKey = key.toUpperCase();

      if (upperKey === 'ENTER') {
        if (currentGuess.length !== wordLength) {
          toast.warning(t('notEnoughLetters'));
          return;
        }
        guess(currentGuess);
      } else if (upperKey === 'DELETE' || upperKey === 'BACKSPACE') {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(upperKey)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess((currentGuess + upperKey).toLowerCase());
        }
      }
    },
    [currentGuess, wordLength, isGameOver, isSubmitting, guess, setCurrentGuess],
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
