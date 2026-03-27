import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createStory, storyQueries } from '@/entities/story';

import type { CreateStory } from './schema';

export function useCreateStoryMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateStory) => {
      return createStory(values.file);
    },
    onSuccess: () => {
      toast.success('Story created successfully!');
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: storyQueries.feed().queryKey });
    },
    onError: error => {
      console.error(error);
      toast.error('Error while creating story.');
    },
  });
}
