import { Suspense, lazy } from 'react';

import { useSearch } from '@tanstack/react-router';

import { CreateContentSelectorModal } from '@/features/create-content-selector';
import type { ModalType } from '@/routes/__root';
import { DialogSkeleton } from '@/shared/ui/dialog-skeleton';

const UserSettingsModal = lazy(() =>
  import('@/widgets/user/user-settings').then(module => ({
    default: module.UserSettingsModal,
  })),
);

const CreatePostModal = lazy(() =>
  import('@/features/post/create-post').then(module => ({ default: module.CreatePostModal })),
);

const MODAL_COMPONENTS: Record<ModalType, React.ComponentType> = {
  'user-settings': UserSettingsModal,
  'create-content': CreateContentSelectorModal,
  'create-post': CreatePostModal,
};

export function ModalProvider() {
  const search = useSearch({ strict: false });
  const modalName = search.modal as ModalType | undefined;

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
