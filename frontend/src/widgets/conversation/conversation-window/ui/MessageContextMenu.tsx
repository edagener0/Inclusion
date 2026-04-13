import { DeleteMessageContextMenuItem } from '@/features/conversation/delete-message';
import { UpdateMessageContextMenuItem } from '@/features/conversation/update-message';

import { type Message, MessageCard } from '@/entities/conversation';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
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
          <UpdateMessageContextMenuItem message={message} />
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <DeleteMessageContextMenuItem messageId={message.id} />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
