import { useEffect, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { IncCardSkeleton, incQueries } from '@/entities/inc';

import { IncListItem } from './IncListItem';

export function IncList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    incQueries.feed(),
  );

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerTarget.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const incs = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <IncCardSkeleton key={i} />)
        : incs.map(inc => <IncListItem key={inc.id} inc={inc} />)}

      <div
        ref={observerTarget}
        className="w-full py-6 flex items-center justify-center text-muted-foreground"
      >
        {isFetchingNextPage && (
          <span className="text-sm font-medium animate-pulse">Loading more incs...</span>
        )}
      </div>
    </div>
  );
}
