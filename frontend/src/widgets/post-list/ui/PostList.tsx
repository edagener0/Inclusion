import { useInfiniteQuery } from '@tanstack/react-query';

import { type Post, PostCardSkeleton } from '@/entities/post';

import type { AnyInfiniteOptions, PaginatedReturnData } from '@/shared/api';
import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

import { PostListItem } from './PostListItem';

type Props = { queryOptions: AnyInfiniteOptions<PaginatedReturnData<Post>> };

export function PostList({ queryOptions }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(queryOptions);

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)
        : allPosts.map((post) => <PostListItem key={post.id} post={post} />)}

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
