import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useInfiniteQuery } from '@tanstack/react-query';

import { CommentCard, commentQueries } from '@/entities/comment';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';
import { CreateComment } from '@/features/comment/create-comment';
import { cn } from '@/shared/lib/utils';

import { CommentActions } from './CommentActions';
import { CommentLikeButton } from './CommentLikeButton';

interface CommentSectionProps {
  entityType: string;
  entityId: number;
  className?: string;
}

export function CommentSection({ entityType, entityId, className }: CommentSectionProps) {
  const user = useSession();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    commentQueries.feed(entityType, entityId),
  );

  const { t } = useTranslation('comment');

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allComments = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <section className={cn('flex flex-col h-full', className)}>
      <div className="flex-none space-y-4 pb-4 border-b border-border/40">
        <h3 className="text-lg font-semibold tracking-tight">Comments</h3>
        <CreateComment entityId={entityId} entityType={entityType} />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 space-y-5 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
        ) : allComments?.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4">{t('empty')}</div>
        ) : (
          allComments?.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              likeSlot={
                <CommentLikeButton
                  entityType={entityType}
                  entityId={entityId}
                  commentId={comment.id}
                  isLiked={comment.isLiked}
                  likesCount={comment.likesCount}
                />
              }
              userAvatarSlot={
                <UserAvatar
                  avatar={comment.user.avatar}
                  username={comment.user.username}
                  className="h-8 w-8 shrink-0"
                />
              }
              actionSlot={
                comment.user.id === user.id ? (
                  <CommentActions comment={comment} entityId={entityId} entityType={entityType} />
                ) : null
              }
            />
          ))
        )}

        <div ref={observerTarget} className="h-1" />
      </div>
    </section>
  );
}
