import type { UserStories } from '../model/schema';

export function getPrevStoryIdFlat(data: UserStories[], currentId: number): number | null {
  const allStories = data.flatMap((r) => r.stories);
  const index = allStories.findIndex((s) => s.id === currentId);

  if (index <= 0) return null;
  return allStories[index - 1].id;
}
