import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { parseDiff, submitGuess, useWordleStore, wordleQueries } from '@/entities/wordle';

import { queryClient } from '@/shared/api';

export function useWordleSubmitMutation() {
  const addGuess = useWordleStore((s) => s.addGuess);
  const { t } = useTranslation('games', { keyPrefix: 'wordle' });

  return useMutation({
    mutationFn: submitGuess,
    onSuccess: (response, request) => {
      addGuess(request, parseDiff(response.diff));

      if (response.correct) {
        toast.success(t('winMessage'));
        queryClient.invalidateQueries({ queryKey: wordleQueries.leaderboard().queryKey });
        queryClient.invalidateQueries({ queryKey: wordleQueries.word().queryKey });
      }
    },
    onError: (error) => {
      toast.error(isAxiosError(error) ? error.message : t('error'));
    },
  });
}
