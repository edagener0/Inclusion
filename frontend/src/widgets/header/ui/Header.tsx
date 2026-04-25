import { type ReactNode, useState } from 'react';

import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';

import { AppLogo } from '@/shared/assets';
import { APP_NAME } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';

type Props = {
  sideBarSlot: ReactNode;
  userMenuSlot: ReactNode;
  notificationSlot: ReactNode;
  searchSlot: ReactNode;
};

export function Header({ sideBarSlot, userMenuSlot, notificationSlot, searchSlot }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:justify-center md:gap-8">
        <div className="flex shrink-0 items-center gap-2 md:w-50">
          <div className="md:hidden">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-65 flex-col p-0 [&>button[data-slot=sheet-close]]:hidden"
              >
                <div className="flex-1 py-4">{sideBarSlot}</div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
            <AppLogo className="text-primary h-7 w-7 md:h-8 md:w-8" />
            <span className="hidden md:inline-block">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex w-full min-w-0 flex-1 items-center justify-end gap-2 md:max-w-2xl md:justify-between">
          <div className="hidden min-w-0 flex-1 items-center md:flex md:px-0">
            <h1 className="truncate text-sm font-bold md:text-lg"></h1>
          </div>

          <div className="flex min-w-0 shrink items-center justify-end gap-2 md:shrink-0 md:gap-4">
            <div className="flex w-full max-w-55 min-w-30 shrink md:max-w-xs">
              <div className="w-full">{searchSlot}</div>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {notificationSlot}
              {userMenuSlot}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
