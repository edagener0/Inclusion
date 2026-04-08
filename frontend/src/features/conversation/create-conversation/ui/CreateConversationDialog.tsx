import { useTranslation } from 'react-i18next';

import { useQueryClient } from '@tanstack/react-query';
import { notFound, useSearch } from '@tanstack/react-router';

import { friendQueries } from '@/entities/friend';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';

import { DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';

import { CreateConversationForm } from './CreateConversationForm';

export function CreateConversationDialog() {
  const { userId } = useSearch({ from: '__root__' });
  if (!userId) throw notFound();

  const { t } = useTranslation('message', { keyPrefix: 'first' });

  const session = useSession();

  const queryClient = useQueryClient();
  const cache = queryClient.getQueryData(
    friendQueries.friendsByUsername(session.username).queryKey,
  );
  const friend = cache?.pages.flatMap((page) => page.data).find((f) => f.id === userId);
  if (!friend) throw notFound();

  return (
    <RoutedDialog>
      <DialogContent className="flex h-125 max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-md">
        <div className="flex h-full flex-col">
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b p-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserAvatar avatar={friend.avatar} username={friend.username} />
              {friend.username}
            </DialogTitle>
          </DialogHeader>

          <div className="bg-muted/10 flex flex-1 flex-col p-4">
            <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center pb-8 text-center">
              <UserAvatar avatar={friend.avatar} username={friend.username} />
              <h3 className="text-foreground font-medium">{friend.username}</h3>
              <p className="mt-1 max-w-62.5 text-sm">{t('description')}</p>
            </div>
          </div>

          <div className="bg-background border-t p-4">
            <CreateConversationForm userId={userId} />
          </div>
        </div>
      </DialogContent>
    </RoutedDialog>
  );
}
