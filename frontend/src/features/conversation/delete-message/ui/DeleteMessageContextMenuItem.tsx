import { useTranslation } from 'react-i18next';

import { TrashIcon } from 'lucide-react';

import { useConfirmModal } from '@/shared/model';
import { ContextMenuItem } from '@/shared/ui/context-menu';

import { useDeleteMessageMutation } from '../model/mutation';

type Props = {
  messageId: number;
};

export function DeleteMessageContextMenuItem({ messageId }: Props) {
  const openConfirm = useConfirmModal((s) => s.openConfirm);
  const { t } = useTranslation('message', { keyPrefix: 'delete' });
  const mutation = useDeleteMessageMutation();

  return (
    <ContextMenuItem
      variant="destructive"
      onSelect={(e) => {
        openConfirm({
          title: t('dialog.title'),
          description: t('dialog.description'),
          confirmText: t('dialog.confirm'),
          isDestructive: true,
          onConfirm: async () => {
            e.preventDefault();
            await mutation.mutateAsync(messageId);
          },
        });
      }}
      className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
    >
      <TrashIcon className="mr-2 h-4 w-4" />
      <span className="whitespace-nowrap">{t('dialog.trigger')}</span>
    </ContextMenuItem>
  );
}
