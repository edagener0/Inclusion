import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';

import { useTimeAgo } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button';

import type { Inc } from '../model/schema';

type Props = {
  inc: Inc;
  userAvatarSlot: ReactNode;
  likeSlot: ReactNode;
  commentsSlot: ReactNode;
};

export function IncDetail({ inc, userAvatarSlot, likeSlot, commentsSlot }: Props) {
  return (
    <div className="flex flex-col w-full h-full bg-background text-foreground overflow-hidden">
      <div className="shrink-0">
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className="shrink-0">{userAvatarSlot}</div>
          <div className="flex flex-col justify-center overflow-hidden">
            <Link
              to="/$username"
              params={{ username: inc.user.username }}
              className="font-bold text-[15px] hover:underline truncate"
            >
              {inc.user.username}
            </Link>
            <span className="text-[15px] text-muted-foreground truncate leading-tight">
              @{inc.user.username}
            </span>
          </div>
        </div>

        <div className="px-4 mt-3 text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-word">
          {inc.content}
        </div>

        <div className="px-4 mt-4 pb-3 flex items-center gap-1 text-[15px] text-muted-foreground">
          <span>{useTimeAgo(inc.createdAt)}</span>
        </div>

        <div className="px-2 py-1 mx-4 border-y border-border flex justify-around items-center text-muted-foreground">
          {likeSlot}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 mt-2 px-4 pb-4">{commentsSlot}</div>
    </div>
  );
}
