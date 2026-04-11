import { PenLine } from 'lucide-react';

import { DeleteMessageContextMenuItem } from '@/features/conversation/delete-message';

import { type Message, MessageCard } from '@/entities/conversation';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';

type Props = {
  message: Message;
};

export function MessageContextMenu({ message }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <MessageCard message={message} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <PenLine />
            Edit
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <DeleteMessageContextMenuItem messageId={message.id} />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
