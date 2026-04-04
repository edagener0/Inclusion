import { useInfiniteQuery } from '@tanstack/react-query';

import { PostCardSkeleton, postQueries } from '@/entities/post';
import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

import { PostListItem } from './PostListItem';

export function PostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    postQueries.feed(),
  );

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allPosts = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)
        : allPosts.map(post => <PostListItem key={post.id} post={post} />)}

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
