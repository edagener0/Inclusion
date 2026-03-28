import { useTranslation } from 'react-i18next';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreateStoryForm } from './CreateStoryForm';

export function CreateStoryModal() {
  const { t } = useTranslation('story', { keyPrefix: 'create' });
  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <CreateStoryForm />
      </DialogContent>
    </RoutedDialog>
  );
}
