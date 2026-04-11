import { CheckCheck } from 'lucide-react';

import { useSession } from '@/entities/session';

import type { Message } from '../model/schema';
import { useFormatDate } from '../model/use-format-date';

type Props = {
  message: Message;
};

export function MessageCard({ message }: Props) {
  const session = useSession();
  const isMe = message.user.id === session.id;

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative flex max-w-[85%] flex-col gap-1 rounded-2xl px-3 py-2 text-sm shadow-sm ${
          isMe
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        }`}
      >
        <span className="leading-relaxed wrap-break-word whitespace-pre-wrap">
          {message.content}
        </span>
        <div className={`flex items-center justify-end gap-1 text-[9px] opacity-70`}>
          {useFormatDate(message.createdAt)}
          {isMe && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}
