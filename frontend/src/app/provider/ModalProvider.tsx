import { Suspense, lazy, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { sessionQueries } from '@/entities/session';
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

// Возвращаем изначальный простой объект
const MODAL_COMPONENTS: Record<ModalType, React.ComponentType> = {
  'user-settings': UserSettingsModal,
  'create-content': CreateContentSelectorModal,
  'create-post': CreatePostModal,
};

export function ModalProvider() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const modalName = search.modal as ModalType | undefined;

  const { data: user } = useQuery(sessionQueries.me());
  const isAuthenticated = !!user;
  const isValidModal = modalName && MODAL_COMPONENTS[modalName];
  const accessDenied = isValidModal && !isAuthenticated;

  useEffect(() => {
    if (accessDenied) {
      navigate({ to: '.', search: { modal: undefined } });
    }
  }, [accessDenied, navigate]);

  if (!isValidModal || accessDenied) return null;

  const ActiveModal = MODAL_COMPONENTS[modalName];

  return (
    <Suspense fallback={<DialogSkeleton />}>
      <ActiveModal />
    </Suspense>
  );
}
