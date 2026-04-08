import { useTranslation } from 'react-i18next';

import { createFileRoute } from '@tanstack/react-router';

import { ConversationList } from '@/widgets/conversation/conversation-list';
import { NotesSection } from '@/widgets/notes-section';

import { SelectFriendDialog } from '@/features/conversation/create-conversation';

import { loadNamespace } from '@/shared/config';

export const Route = createFileRoute('/_main/messages')({
  component: Messages,
  loader: async () => {
    await loadNamespace(['note', 'message']);
  },
});

// eslint-disable-next-line react-refresh/only-export-components
function Messages() {
  const { t } = useTranslation('message');

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b pb-4">
        <NotesSection />
      </div>

      <div className="flex min-h-0 flex-1 flex-col pt-4">
        <div className="mb-4 flex items-center justify-between pr-4">
          <h2 className="text-xl font-bold">{t('title')}</h2>
          <SelectFriendDialog />
        </div>

        <ConversationList />
      </div>
    </div>
  );
}
