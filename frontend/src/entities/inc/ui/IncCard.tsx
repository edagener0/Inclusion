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
  actionsSlot?: ReactNode;
};

export function IncCard({ userAvatarSlot, likeSlot, actionsSlot, inc }: Props) {
  return (
    <article className="w-full max-w-150 mx-auto flex gap-3 px-4 pt-3 pb-2 border-b border-border bg-background hover:bg-muted/10 transition-colors cursor-pointer">
      <div className="shrink-0">{userAvatarSlot}</div>
      <div className="flex flex-col w-full min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-[15px]">
            <Link
              to="/$username"
              params={{ username: inc.user.username }}
              className="font-bold text-foreground hover:underline truncate"
            >
              {inc.user.username}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              to="/incs/$id"
              params={{ id: String(inc.id) }}
              resetScroll={false}
              className="text-muted-foreground hover:underline whitespace-nowrap text-sm"
            >
              {useTimeAgo(inc.createdAt)}
            </Link>
          </div>

          {actionsSlot && (
            <div className="shrink-0 -mt-2 -mr-2 text-muted-foreground">{actionsSlot}</div>
          )}
        </div>

        <div className="mt-0.5 text-[15px] leading-snug text-foreground whitespace-pre-wrap wrap-break-word">
          {inc.content}
        </div>

        <div className="flex items-center justify-start gap-12 mt-3 text-muted-foreground max-w-md">
          <div className="flex items-center">{likeSlot}</div>

          <Link
            to="/incs/$id"
            params={{ id: String(inc.id) }}
            resetScroll={false}
            className="group flex items-center gap-1 cursor-pointer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-foreground hover:text-muted-foreground hover:bg-transparent transition-colors"
            >
              <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
