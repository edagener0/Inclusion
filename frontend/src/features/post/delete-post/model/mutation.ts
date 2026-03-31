import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deletePost, postQueries } from '@/entities/post';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const feedQueryKey = postQueries.feed().queryKey;
  const { t } = useTranslation('post', { keyPrefix: 'delete' });

  return useMutation({
    mutationFn: deletePost,
    onMutate: async deletedPostId => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });
      const previousFeed = queryClient.getQueryData(feedQueryKey);

      queryClient.setQueryData(feedQueryKey, oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(post => post.id !== deletedPostId),
          })),
        };
      });

      return { previousFeed };
    },
    onSuccess: () => {
      toast.success(t('success'));
      queryClient.invalidateQueries({ queryKey: postQueries.feed().queryKey });
    },
    onError: (error, _, context) => {
      console.error(error);
      toast.error(t('error'));

      if (context?.previousFeed) {
        queryClient.setQueryData(feedQueryKey, context.previousFeed);
      }
    },
  });
}
