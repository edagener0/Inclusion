import { useTranslation } from 'react-i18next';

import { Bell } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

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
          <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />

          {totalCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground shadow-sm">
              {totalCount > 9 ? '9+' : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0" align="end" sideOffset={12} forceMount>
        <Tabs defaultValue="all" className="flex flex-col w-full">
          <div className="flex flex-col gap-4 p-4 pb-2 border-b border-border/50">
            <h4 className="text-sm font-semibold leading-none tracking-tight">{t('title')}</h4>

            <TabsList className="grid w-full grid-cols-2 p-1 h-9">
              <TabsTrigger
                value="all"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                {t('all.title')}
              </TabsTrigger>

              <TabsTrigger
                value="requests"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md group"
              >
                {t('requests.title')}
                {friends > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white bg-red-500 shadow-sm transition-colors">
                    {friends}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <FriendRequestsTab />

          <TabsContent value="all" className="m-0 border-none outline-none">
            <ScrollArea className="h-80">
              <div className="flex flex-col p-4">
                <p className="mt-8 text-center text-sm text-muted-foreground">{t('all.empty')}</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
