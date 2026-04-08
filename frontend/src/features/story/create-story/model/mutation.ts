import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createStory, storyQueries } from '@/entities/story';

import type { CreateStory } from './schema';

export function useCreateStoryMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('story', { keyPrefix: 'create' });

  return useMutation({
    mutationFn: async (values: CreateStory) => {
      return createStory(values.file);
    },
    onSuccess: () => {
      toast.success(t('success'));
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: storyQueries.feed().queryKey });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
