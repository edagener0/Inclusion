import type { ReactNode } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Dialog } from '@/shared/ui/dialog';

interface RoutedDialogProps {
  children: ReactNode;
}

export function RoutedDialog({ children }: RoutedDialogProps) {
  const navigate = useNavigate();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      navigate({
        to: '.',
        search: prev => ({
          ...prev,
          modal: undefined,
        }),
        replace: true,
      });
    }
  };
  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      {children}
    </Dialog>
  );
}
