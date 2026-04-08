import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createPost, postQueries } from '@/entities/post';

import type { CreatePost } from './schema';

export function useCreatePostMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('post', { keyPrefix: 'create' });

  return useMutation({
    mutationFn: async (values: CreatePost) => {
      return createPost({
        description: values.description,
        file: values.file,
      });
    },
    onSuccess: () => {
      toast.success(t('success'));
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: postQueries.feed().queryKey });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
