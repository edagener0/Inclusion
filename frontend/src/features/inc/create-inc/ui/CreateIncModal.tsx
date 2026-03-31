import { useTranslation } from 'react-i18next';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreateIncForm } from './CreateIncForm';

export function CreateIncModal() {
  const { t } = useTranslation('inc', { keyPrefix: 'create' });

  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <CreateIncForm />
      </DialogContent>
    </RoutedDialog>
  );
}
