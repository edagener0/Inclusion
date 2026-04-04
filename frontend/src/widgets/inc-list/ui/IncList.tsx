import { useInfiniteQuery } from '@tanstack/react-query';

import { IncCardSkeleton, incQueries } from '@/entities/inc';
import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

import { IncListItem } from './IncListItem';

export function IncList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    incQueries.feed(),
  );

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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
          <span className="text-sm font-medium animate-pulse">
            <CenterSpinner className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
