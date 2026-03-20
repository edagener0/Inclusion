import { useEffect, useRef } from 'react';

import { type QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import { CommentCard, commentQueries } from '@/entities/comment';
import { CreateComment } from '@/features/comment/create-comment';
import { LikeButton } from '@/features/like-toggle';
import { cn } from '@/shared/lib/utils/utils';

import { CommentActions } from './CommentActions';

interface CommentSectionProps {
  entityType: string;
  entityId: number;
  className?: string;
  queryKey: QueryKey;
}

export function CommentSection({ queryKey, entityType, entityId, className }: CommentSectionProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    commentQueries.feed(entityType, entityId),
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

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allComments = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <section className={cn('flex flex-col ', className)}>
      <div className="flex-none space-y-4 pb-4 border-b border-border/40">
        <h3 className="text-lg font-semibold tracking-tight">Comments</h3>
        <CreateComment entityId={entityId} entityType={entityType} />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 space-y-5 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
        ) : allComments?.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4">
            There are no comments yet. Be the first!
          </div>
        ) : (
          allComments?.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              likeSlot={
                <LikeButton
                  entityType={entityType}
                  entityId={entityId}
                  isLiked={comment.isLiked}
                  likesCount={comment.likesCount}
                  queryKey={queryKey}
                />
              }
              actionSlot={
                <CommentActions comment={comment} entityId={entityId} entityType={entityType} />
              }
            />
          ))
        )}

        <div ref={observerTarget} className="h-1" />
      </div>
    </section>
  );
}
