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
  isMe: boolean;
};

export function MessageContextMenu({ message, isMe }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <MessageCard message={message} isMe={isMe} />
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
