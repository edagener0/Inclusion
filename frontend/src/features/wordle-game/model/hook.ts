import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import { selectUsedLetters, useWordleStore } from '@/entities/wordle';

import { useWordleSubmitMutation } from './mutation';

type Props = {
  wordLength: number;
};

export function useWordleGame({ wordLength }: Props) {
  const { t } = useTranslation('games', { keyPrefix: 'hook' });

  const currentGuess = useWordleStore((state) => state.currentGuess);
  const guesses = useWordleStore((state) => state.guesses);
  const results = useWordleStore((state) => state.results);
  const setCurrentGuess = useWordleStore((state) => state.setCurrentGuess);

  const usedLetters = useWordleStore(useShallow(selectUsedLetters));
  const { mutate, isPending } = useWordleSubmitMutation();

  const onKeyPress = useCallback(
    (key: string) => {
      if (isPending) return;

      const upperKey = key.toUpperCase();

      if (upperKey === 'ENTER') {
        if (currentGuess.length !== wordLength) {
          toast.warning(t('notEnoughLetters'));
          return;
        }
        mutate(currentGuess);
      } else if (upperKey === 'DELETE' || upperKey === 'BACKSPACE') {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(upperKey)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess((currentGuess + upperKey).toLowerCase());
        }
      }
    },
    [currentGuess, wordLength, isPending, mutate, setCurrentGuess, t],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      onKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return {
    guesses,
    results,
    currentGuess,
    wordLength,
    isSubmitting: isPending,
    usedLetters,
    onKeyPress,
  };
}
