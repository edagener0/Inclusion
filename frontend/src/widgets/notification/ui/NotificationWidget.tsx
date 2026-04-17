import { useTranslation } from 'react-i18next';

import { Bell } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { useNotificationCountStore } from '../model/store';
import { FriendRequestsTab } from './FriendRequestsTab';

export function NotificationWidget() {
  const { t } = useTranslation('common', { keyPrefix: 'notification' });
  const { total, friends } = useNotificationCountStore();
  const totalCount = total();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-transparent">
          <Bell className="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors" />

          {totalCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-sm">
              {totalCount > 9 ? '9+' : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0" align="end" sideOffset={12} forceMount>
        <Tabs defaultValue="requests" className="flex w-full flex-col">
          <div className="border-border/50 flex flex-col gap-4 border-b p-4 pb-2">
            <h4 className="text-sm leading-none font-semibold tracking-tight">{t('title')}</h4>

            <TabsList className="grid h-9 w-full grid-cols-1 p-1">
              <TabsTrigger
                value="requests"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground group data-[state=active]:shadow-md"
              >
                {t('requests.title')}
                {friends > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm transition-colors">
                    {friends}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <FriendRequestsTab />
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
