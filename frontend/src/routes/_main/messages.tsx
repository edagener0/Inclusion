import { useTranslation } from 'react-i18next';

import { createFileRoute } from '@tanstack/react-router';

import { loadNamespace } from '@/shared/config';
import { NotesSection } from '@/widgets/notes-section';

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
      <div className="border-b max-h-60 overflow-y-hidden">
        <NotesSection />
      </div>
      <h2 className="text-xl font-bold pt-4">{t('title')}</h2>
    </div>
  );
}
