import { Suspense, lazy } from 'react';

import { CheckCheck } from 'lucide-react';

import { CenterSpinner } from '@/shared/ui/spinner';

import type { Message } from '../model/schema';
import { useFormatDate } from '../model/use-format-date';

const MarkdownRendererLazy = lazy(() =>
  import('@/shared/ui/markdown').then((module) => ({
    default: module.MarkdownRenderer,
  })),
);

type Props = {
  message: Message;
  isMe: boolean;
  useMarkdown?: boolean;
};

export function MessageCard({ message, isMe, useMarkdown = false }: Props) {
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
          {useMarkdown ? (
            <Suspense
              fallback={
                <span className="opacity-50">
                  <CenterSpinner />
                </span>
              }
            >
              <MarkdownRendererLazy content={message.content} />
            </Suspense>
          ) : (
            message.content
          )}
        </span>
        <div className={`flex items-center justify-end gap-1 text-[9px] opacity-70`}>
          {useFormatDate(message.createdAt)}
          {isMe && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}
