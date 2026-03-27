import type { Story, UserStories } from './schema';

export const updateStoryLikeInCache = (
  node: UserStories,
  storyId: number,
  newIsLiked: boolean,
  newCount: number,
): UserStories => {
  if (!node.stories) return node;
  return {
    ...node,
    stories: node.stories.map((story: Omit<Story, 'user'>) =>
      story.id === storyId ? { ...story, isLiked: newIsLiked, likesCount: newCount } : story,
    ),
  };
};
