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
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-center gap-x-8 px-4">
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
                className="flex w-65 flex-col p-0 **:data-[slot=sheet-close]:hidden"
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

        <div className="flex w-full max-w-2xl items-center justify-between">
          <div className="flex flex-1 items-center md:px-0">
            <h1 className="truncate text-sm font-bold md:text-lg"></h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            {searchSlot}
            {notificationSlot}
            {userMenuSlot}
          </div>
        </div>
      </div>
    </header>
  );
}
