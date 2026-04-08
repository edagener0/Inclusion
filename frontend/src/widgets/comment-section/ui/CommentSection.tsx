import { useTranslation } from 'react-i18next';

import { useInfiniteQuery } from '@tanstack/react-query';

import { CreateComment } from '@/features/comment/create-comment';

import { CommentCard, CommentCardSkeleton, commentQueries } from '@/entities/comment';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
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
  const { t } = useTranslation('comment');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    commentQueries.feed(entityType, entityId),
  );

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allComments = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section className={cn('flex h-full flex-col', className)}>
      <div className="border-border/40 flex-none space-y-4 border-b pb-4">
        <h3 className="text-lg font-semibold tracking-tight">{t('title')}</h3>
        <CreateComment entityId={entityId} entityType={entityType} />
      </div>

      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto pt-4 pr-2">
        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, index) => (
              <CommentCardSkeleton key={index} />
            ))}
          </div>
        ) : allComments?.length === 0 ? (
          <div className="text-muted-foreground py-4 text-sm">{t('empty')}</div>
        ) : (
          allComments?.map((comment) => (
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
