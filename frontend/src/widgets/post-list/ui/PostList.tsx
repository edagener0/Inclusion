import { useEffect, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { PostCard, PostCardSkeleton, postQueries } from '@/entities/post';

export function PostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    postQueries.feed(),
  );

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div className="space-y-4">
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
        : allPosts.map(post => <PostCard key={post.id} post={post} />)}

      <div
        ref={observerTarget}
        className="w-full py-6 flex items-center justify-center text-muted-foreground"
      >
        {isFetchingNextPage && (
          <span className="text-sm font-medium animate-pulse">Loading more posts...</span>
        )}
      </div>
    </div>
  );
}
