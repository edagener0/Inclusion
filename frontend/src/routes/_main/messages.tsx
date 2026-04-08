import { useTranslation } from 'react-i18next';

import { createFileRoute } from '@tanstack/react-router';

import { NotesSection } from '@/widgets/notes-section';

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
    <div className="flex flex-col">
      <div className="max-h-60 overflow-y-hidden border-b">
        <NotesSection />
      </div>
      <h2 className="pt-4 text-xl font-bold">{t('title')}</h2>
    </div>
  );
}
