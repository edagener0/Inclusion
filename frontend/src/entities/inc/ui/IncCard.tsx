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
    <article className="border-border bg-background hover:bg-muted/10 mx-auto flex w-full max-w-150 cursor-pointer gap-3 border-b px-4 pt-3 pb-2 transition-colors">
      <div className="shrink-0">{userAvatarSlot}</div>
      <div className="flex w-full min-w-0 flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-[15px]">
            <Link
              to="/$username"
              params={{ username: inc.user.username }}
              className="text-foreground truncate font-bold hover:underline"
            >
              {inc.user.username}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              to="/incs/$id"
              params={{ id: String(inc.id) }}
              resetScroll={false}
              className="text-muted-foreground text-sm whitespace-nowrap hover:underline"
            >
              {useTimeAgo(inc.createdAt)}
            </Link>
          </div>

          {actionsSlot && (
            <div className="text-muted-foreground -mt-2 -mr-2 shrink-0">{actionsSlot}</div>
          )}
        </div>

        <div className="text-foreground mt-0.5 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap">
          {inc.content}
        </div>

        <div className="text-muted-foreground mt-3 flex max-w-md items-center justify-start gap-12">
          <div className="flex items-center">{likeSlot}</div>

          <Link
            to="/incs/$id"
            params={{ id: String(inc.id) }}
            resetScroll={false}
            className="group flex cursor-pointer items-center gap-1"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-muted-foreground h-9 w-9 transition-colors hover:bg-transparent"
            >
              <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
