import { useTranslation } from 'react-i18next';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreatePostForm } from './CreatePostForm';

export function CreatePostModal() {
  const { t } = useTranslation('post', { keyPrefix: 'create.dialog' });

  return (
    <RoutedDialog>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <CreatePostForm />
      </DialogContent>
    </RoutedDialog>
  );
}
