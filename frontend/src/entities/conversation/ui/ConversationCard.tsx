import type { ReactNode } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { Conversation } from '../model/schema';
import { useFormatDate } from '../model/use-format-date';

type Props = {
  conversation: Conversation;
  avatarSlot: ReactNode;
};

export function ConversationCard({ conversation, avatarSlot }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 border-b p-3 transition-colors last:border-0"
      onClick={() => navigate({ to: '/messages/$id', params: { id: conversation.user.username } })}
    >
      {avatarSlot}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-medium">{conversation.user.username}</h3>
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {useFormatDate(conversation.createdAt)}
          </span>
        </div>
        <p className="text-muted-foreground truncate text-sm">{conversation.lastMessage}</p>
      </div>
    </div>
  );
}
