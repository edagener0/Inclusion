import { type ReactNode } from 'react';

import { useTimeAgo } from '@/shared/lib/hooks';

import type { Comment } from '../model/schema';

type Props = {
  comment: Comment;
  likeSlot: ReactNode;
  userAvatarSlot: ReactNode;
  actionSlot?: ReactNode;
};

export function CommentCard({ comment, likeSlot, actionSlot, userAvatarSlot }: Props) {
  return (
    <div className="group border-border/50 flex gap-3 border-b py-3 last:border-0">
      {userAvatarSlot}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="cursor-pointer text-sm font-bold hover:underline">
                {comment.user.username}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {useTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-foreground mt-1 text-sm break-all whitespace-pre-wrap">
              {comment.commentary}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            {likeSlot}
            <div className="relative">{actionSlot}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
