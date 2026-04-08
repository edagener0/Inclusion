import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  isDestructive = true,
}: ConfirmDialogProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'confirm-dialog' });
  if (!title) title = t('title');
  if (!description) description = t('description');
  if (!confirmText) confirmText = t('confirm');
  if (!cancelText) cancelText = t('cancel');

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-200">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={
              isDestructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
