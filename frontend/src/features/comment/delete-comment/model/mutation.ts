import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { type Comment, commentQueries } from '@/entities/comment';
import { deleteComment } from '@/entities/comment';

type DeleteCommentVars = {
  commentId: number;
  entityType: string;
  entityId: number;
};

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('comment', { keyPrefix: 'delete' });

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentVars) => deleteComment(commentId),
    onMutate: async (variables) => {
      const feedQueryKey = commentQueries.feed(variables.entityType, variables.entityId).queryKey;
      await queryClient.cancelQueries({ queryKey: feedQueryKey });
      const previousFeed = queryClient.getQueryData(feedQueryKey);

      queryClient.setQueryData(feedQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((comment: Comment) => comment.id !== variables.commentId),
          })),
        };
      });

      return { previousFeed, feedQueryKey };
    },

    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: (error, _, context) => {
      console.error(error);
      toast.error(t('error'));

      if (context?.previousFeed && context?.feedQueryKey) {
        queryClient.setQueryData(context.feedQueryKey, context.previousFeed);
      }
    },
    onSettled: (_, __, variables) => {
      if (variables) {
        const feedQueryKey = commentQueries.feed(variables.entityType, variables.entityId).queryKey;
        queryClient.invalidateQueries({ queryKey: feedQueryKey });
      }
    },
  });
}
