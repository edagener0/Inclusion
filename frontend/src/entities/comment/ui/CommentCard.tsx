import { type ReactNode } from 'react';

import { ProfileAvatar } from '@/entities/profile';
import { timeAgo } from '@/shared/lib/time-ago';

import type { Comment } from '../model/types';

type Props = {
  comment: Comment;
  likeSlot?: ReactNode;
  actionSlot?: ReactNode;
};

export function CommentCard({ comment, likeSlot, actionSlot }: Props) {
  return (
    <div className="group flex gap-3 py-3 border-b border-border/50 last:border-0">
      <ProfileAvatar
        avatar={comment.user.avatar}
        username={comment.user.username}
        className="h-8 w-8 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm hover:underline cursor-pointer">
                {comment.user.username}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap break-all mt-1">
              {comment.commentary}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {likeSlot}
            <div className="relative">{actionSlot}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
