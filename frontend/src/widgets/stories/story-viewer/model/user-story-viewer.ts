import { useCallback, useMemo, useState } from 'react';

import { type UserStories, getNextStoryIdFlat, getPrevStoryIdFlat } from '@/entities/story';

export function useStoryViewer(data: UserStories[], initialId: number, onClose?: () => void) {
  const [currentId, setCurrentId] = useState(initialId);

  const { currentStory, currentUserGroup, currentIndex } = useMemo(() => {
    const group = data.find((g) => g.stories.some((s) => s.id === currentId));

    if (!group) {
      return { currentStory: null, currentUserGroup: null, currentIndex: -1 };
    }

    const index = group.stories.findIndex((s) => s.id === currentId);

    return {
      currentStory: group.stories[index],
      currentUserGroup: group,
      currentIndex: index,
    };
  }, [data, currentId]);

  const next = useCallback(() => {
    const nextId = getNextStoryIdFlat(data, currentId);
    if (nextId) {
      setCurrentId(nextId);
    } else {
      onClose?.();
    }
  }, [data, currentId, onClose]);

  const prev = useCallback(() => {
    const prevId = getPrevStoryIdFlat(data, currentId);
    if (prevId) {
      setCurrentId(prevId);
    }
  }, [data, currentId]);

  return {
    currentId,
    currentStory,
    currentUserGroup,
    currentIndex,
    next,
    prev,
  };
}
