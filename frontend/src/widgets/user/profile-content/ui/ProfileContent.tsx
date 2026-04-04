import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ImagesIcon, ScrollTextIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface Props {
  postsSlot: ReactNode;
  incsSlot: ReactNode;
}

export function ProfileContent({ postsSlot, incsSlot }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="w-full mt-4 block">
      <Tabs defaultValue="incs" className="w-full flex flex-col">
        <div className="w-full mb-2">
          <TabsList className="flex flex-row w-full h-auto p-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl">
            <TabsTrigger
              value="incs"
              className="flex-1 flex items-center justify-center py-2.5 rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 shadow-sm transition-all"
            >
              <ScrollTextIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('sideBar.incs')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex-1 flex items-center justify-center py-2.5 rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 shadow-sm transition-all"
            >
              <ImagesIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('sideBar.posts')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="m-0 space-y-4 outline-none">
          {postsSlot}
        </TabsContent>

        <TabsContent value="incs" className="m-0 space-y-4 outline-none">
          {incsSlot}
        </TabsContent>
      </Tabs>
    </div>
  );
}
