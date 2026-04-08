import { useTranslation } from 'react-i18next';

import { useNavigate } from '@tanstack/react-router';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { items } from '../model/types';

export function CreateContentSelectorModal() {
  const navigate = useNavigate();
  const { t } = useTranslation('common', { keyPrefix: 'createContent' });

  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate({ to: '.', search: { modal: item.modal } })}
              className="hover:bg-accent hover:border-primary group flex items-center gap-4 rounded-xl border p-4 text-left transition-all"
            >
              <div className="bg-background group-hover:border-primary/50 flex h-10 w-10 items-center justify-center rounded-lg border">
                <item.icon className="text-muted-foreground group-hover:text-primary h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-base font-medium">{t(item.label)}</div>
                <p className="text-muted-foreground text-sm">{t(item.description)}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </RoutedDialog>
  );
}
