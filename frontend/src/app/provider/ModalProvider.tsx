import { Suspense, lazy } from 'react';

import { useSearch } from '@tanstack/react-router';

import { DialogSkeleton } from '@/shared/ui/dialog-skeleton';

const UserSettingsModal = lazy(() =>
  import('@/widgets/user-settings').then(module => ({
    default: module.UserSettingsModal,
  })),
);

const MODAL_COMPONENTS: Record<string, React.ComponentType> = {
  'user-settings': UserSettingsModal,
};

export function ModalProvider() {
  const search = useSearch({ strict: false });
  const modalName = search.modal as string | undefined;

  if (!modalName || !MODAL_COMPONENTS[modalName]) {
    return null;
  }

  const ActiveModal = MODAL_COMPONENTS[modalName];

  return (
    <Suspense fallback={<DialogSkeleton />}>
      <ActiveModal />
    </Suspense>
  );
}
