import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import type { Conversation } from '../model/schema';
import { useFormatDate } from '../model/use-format-date';

type Props = {
  conversation: Conversation;
  avatarSlot: ReactNode;
  className?: string;
};

export function ConversationCard({ conversation, avatarSlot, className }: Props) {
  return (
    <article
      className={cn(
        'flex items-center gap-4 border-b p-3 transition-colors last:border-0',
        className,
      )}
    >
      <div className="shrink-0">{avatarSlot}</div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <h3 className="text-foreground truncate text-sm font-medium">
            {conversation.user.username}
          </h3>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {useFormatDate(conversation.createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground truncate text-sm">{conversation.lastMessage}</p>
      </div>
    </article>
  );
}
