import { useTranslation } from 'react-i18next';

import { Trash } from 'lucide-react';

import { useConfirmModal } from '@/shared/model';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

import { useDeleteStoryMutation } from '../model/mutation';

export function DeleteStoryMenuItem({ id }: { id: number }) {
  const openConfirm = useConfirmModal(s => s.openConfirm);
  const { t } = useTranslation('story', { keyPrefix: 'delete' });
  const mutation = useDeleteStoryMutation();

  return (
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
  );
}
