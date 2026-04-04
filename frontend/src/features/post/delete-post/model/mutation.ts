import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deletePost, postQueries } from '@/entities/post';
import { useSession } from '@/entities/session';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { t } = useTranslation('post', { keyPrefix: 'delete' });

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      toast.success(t('success'));

      [postQueries.byUsername(session.username).queryKey, postQueries.feed().queryKey].forEach(
        (key) => {
          queryClient.setQueryData(key, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.filter((post) => post.id !== postId),
              })),
            };
          });
        },
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
