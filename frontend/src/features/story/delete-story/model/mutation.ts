import { useTranslation } from 'react-i18next';

import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';

import { type UserStories, storyQueries } from '@/entities/story';
import { deleteStory } from '@/entities/story';

type FeedPage = {
  data: UserStories[];
  hasNextPage: boolean;
};

export function useDeleteStoryMutation() {
  const navigate = useNavigate();
  const { from } = useSearch({ from: '/_main/stories/$id' });
  const queryClient = useQueryClient();
  const { t } = useTranslation('story', { keyPrefix: 'delete' });
  const feedQueryKey = storyQueries.feed().queryKey;

  return useMutation({
    mutationFn: deleteStory,
    onMutate: async (deletedPostId) => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });
      const previousFeed = queryClient.getQueryData(feedQueryKey);

      queryClient.setQueryData(
        feedQueryKey,
        (oldData: InfiniteData<FeedPage, unknown> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const updatedData = page.data.map((userStoryNode) => {
                if (!userStoryNode.stories) return userStoryNode;

                const filteredStories = userStoryNode.stories.filter(
                  (story) => story.id !== deletedPostId,
                );

                if (filteredStories.length === 0) return null;

                return { ...userStoryNode, stories: filteredStories };
              });

              return {
                ...page,
                data: updatedData.filter((node): node is UserStories => node !== null),
              };
            }),
          };
        },
      );
      return { previousFeed };
    },
    onSuccess: () => {
      navigate({ to: from });
      toast.success(t('success'));
      queryClient.invalidateQueries({ queryKey: storyQueries.feed().queryKey });
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
