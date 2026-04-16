import { createLazyFileRoute } from '@tanstack/react-router';

import { ChatBotConversation } from '@/widgets/conversation/chat-bot-conversation';

export const Route = createLazyFileRoute('/_main/chat-bot')({
  component: ChatBotConversation,
});
