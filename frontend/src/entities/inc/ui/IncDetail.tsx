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
    <div className="bg-background text-foreground flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className="shrink-0">{userAvatarSlot}</div>
          <div className="flex flex-col justify-center overflow-hidden">
            <Link
              to="/$username"
              params={{ username: inc.user.username }}
              className="truncate text-[15px] font-bold hover:underline"
            >
              {inc.user.username}
            </Link>
            <span className="text-muted-foreground truncate text-[15px] leading-tight">
              @{inc.user.username}
            </span>
          </div>
        </div>

        <div className="mt-3 px-4 text-[15px] leading-relaxed wrap-break-word whitespace-pre-wrap">
          {inc.content}
        </div>

        <div className="text-muted-foreground mt-4 flex items-center gap-1 px-4 pb-3 text-[15px]">
          <span>{useTimeAgo(inc.createdAt)}</span>
        </div>

        <div className="border-border text-muted-foreground mx-4 flex items-center justify-around border-y px-2 py-1">
          {likeSlot}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full transition-colors hover:bg-blue-500/10 hover:text-blue-500"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 px-4 pb-4">{commentsSlot}</div>
    </div>
  );
}
