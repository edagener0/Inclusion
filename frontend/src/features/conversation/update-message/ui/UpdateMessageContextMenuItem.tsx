import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PenLine } from 'lucide-react';

import type { Message } from '@/entities/conversation';

import { dispatchEscape } from '@/shared/lib/dom';
import { ContextMenuItem } from '@/shared/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

import { UpdateMessageForm } from './UpdateMessageForm';

type Props = {
  message: Message;
};

export function UpdateMessageContextMenuItem({ message }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('message', { keyPrefix: 'update' });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <PenLine />
          Edit
        </ContextMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <UpdateMessageForm
          message={message}
          onSuccess={() => {
            setIsOpen(false);
            dispatchEscape();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
