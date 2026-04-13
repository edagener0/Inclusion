import { createLazyFileRoute } from '@tanstack/react-router';

import { ConversationWindow } from '@/widgets/conversation/conversation-window';

export const Route = createLazyFileRoute('/_main/messages/$id')({
  component: ConversationWindow,
});
