import { AskChatBotInput } from '@/features/ask-chat-bot';

import { bot, useChatBotStore } from '@/entities/chat-bot';
import { MessageCard } from '@/entities/conversation';
import { useSession } from '@/entities/session';

import { BaseAvatar } from '@/shared/ui/base-avatar';

export function ChatBotConversation() {
  const rawMessages = useChatBotStore((state) => state.messages);
  const messages = rawMessages.toReversed();
  const isThinking = useChatBotStore((s) => s.isBotThinking);
  const session = useSession();

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      <div className="bg-background/95 z-10 flex shrink-0 items-center justify-between gap-2 border-b py-2 backdrop-blur sm:px-4 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
          <BaseAvatar src={bot.avatar} alt={bot.username} />
          <span>{bot.username}</span>
        </div>
      </div>

      <div className="bg-muted/5 relative flex min-h-0 w-full flex-1 flex-col-reverse overflow-y-auto pr-5 pl-5">
        <div className="mx-auto flex w-full max-w-4xl flex-col-reverse gap-3 p-3 pb-8 sm:gap-4 sm:p-4">
          {messages.map((msg) => (
            <MessageCard
              key={msg.id}
              message={{
                createdAt: msg.createdAt,
                content: msg.message,
                id: msg.id,
                updatedAt: new Date(),
                user: msg.isBot ? bot : session,
              }}
              isMe={!msg.isBot}
              useMarkdown
            />
          ))}
        </div>
      </div>

      <div className="bg-background shrink-0 border-t p-2 sm:p-4">
        {isThinking && (
          <span className="text-muted-foreground mb-2 block animate-pulse px-1 text-xs italic">
            Bot is thinking...
          </span>
        )}
        <AskChatBotInput />
      </div>
    </div>
  );
}
