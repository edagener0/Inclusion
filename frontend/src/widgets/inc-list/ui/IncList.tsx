import { useInfiniteQuery } from '@tanstack/react-query';

import { type Inc, IncCardSkeleton } from '@/entities/inc';

import type { AnyInfiniteOptions, PaginatedReturnData } from '@/shared/api';
import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

import { IncListItem } from './IncListItem';

type Props = { queryOptions: AnyInfiniteOptions<PaginatedReturnData<Inc>> };

export function IncList({ queryOptions }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(queryOptions);

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const incs = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <IncCardSkeleton key={i} />)
        : incs.map((inc) => <IncListItem key={inc.id} inc={inc} />)}

      <div
        ref={observerTarget}
        className="text-muted-foreground flex w-full items-center justify-center py-6"
      >
        {isFetchingNextPage && (
          <span className="animate-pulse text-sm font-medium">
            <CenterSpinner className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
