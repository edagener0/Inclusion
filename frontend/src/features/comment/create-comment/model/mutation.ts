import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { commentQueries } from '@/entities/comment';
import { createComment } from '@/entities/comment';

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      toast.success('Comment created successfully!');

      queryClient.invalidateQueries({
        queryKey: commentQueries.feed(variables.entityType, variables.entityId).queryKey,
      });
    },
    onError: error => {
      console.error(error);
      toast.error('Error while creating comment.');
    },
  });
}
