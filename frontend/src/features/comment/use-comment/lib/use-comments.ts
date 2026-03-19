import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { commentQueries } from '@/entities/comment';

export function useComments(endpoint: string) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    ...commentQueries.feed(endpoint),
    enabled: isOpen,
  });

  const allComments = data?.pages.flatMap(page => page.data) ?? [];

  return {
    isOpen,
    setIsOpen,
    comments: allComments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
