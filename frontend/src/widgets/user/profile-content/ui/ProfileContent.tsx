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
    <div className="mt-4 block w-full">
      <Tabs defaultValue="incs" className="flex w-full flex-col">
        <div className="mb-2 w-full">
          <TabsList className="flex h-auto w-full flex-row rounded-xl bg-zinc-100/50 p-1 dark:bg-zinc-900/50">
            <TabsTrigger
              value="incs"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 shadow-sm transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
            >
              <ScrollTextIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('sideBar.incs')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 shadow-sm transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
            >
              <ImagesIcon className="h-4 w-4" />
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
