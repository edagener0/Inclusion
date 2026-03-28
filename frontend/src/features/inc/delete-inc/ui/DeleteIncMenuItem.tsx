import { useTranslation } from 'react-i18next';

import { Trash } from 'lucide-react';

import { useConfirmModal } from '@/shared/model';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

import { useDeleteIncMutation } from '../model/mutation';

export function DeleteIncMenuItem({ id }: { id: number }) {
  const openConfirm = useConfirmModal(s => s.openConfirm);
  const mutation = useDeleteIncMutation();
  const { t } = useTranslation('inc', { keyPrefix: 'delete' });

  return (
    <>
      <DropdownMenuItem
        onSelect={e => {
          openConfirm({
            title: t('dialog.title'),
            description: t('dialog.description'),
            confirmText: t('dialog.confirm'),
            isDestructive: true,
            onConfirm: async () => {
              e.preventDefault();
              await mutation.mutateAsync(id);
            },
          });
        }}
        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
      >
        <Trash className="mr-2 h-4 w-4" />
        <span>{t('dialog.trigger')}</span>
      </DropdownMenuItem>
    </>
  );
}
