import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteInc, incQueries } from '@/entities/inc';

export function useDeleteIncMutation() {
  const queryClient = useQueryClient();
  const feedQueryKey = incQueries.feed().queryKey;

  return useMutation({
    mutationFn: deleteInc,
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
      toast.success('Inc deleted successfully!');
      queryClient.invalidateQueries({ queryKey: incQueries.feed().queryKey });
    },
    onError: (error, _, context) => {
      console.error(error);
      toast.error('Error while deleting inc.');

      if (context?.previousFeed) {
        queryClient.setQueryData(feedQueryKey, context.previousFeed);
      }
    },
  });
}
