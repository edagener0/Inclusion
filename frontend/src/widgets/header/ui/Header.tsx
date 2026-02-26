import { useState } from 'react';

import { Link } from '@tanstack/react-router';
import { Menu, Search } from 'lucide-react';

import { SidebarNav } from '@/features/sidebar';
import { UserDropDownMenu } from '@/features/user/user-menu';
import { AppLogo } from '@/shared/assets/icons/AppIcon';
import { APP_NAME } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <div className="flex md:w-50 shrink-0 items-center gap-2">
          <div className="md:hidden">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-65 p-0 flex flex-col **:data-[slot=sheet-close]:hidden"
              >
                <div className="flex-1 py-4">
                  <SidebarNav mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <AppLogo className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <span className="hidden md:inline-block">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center px-2 md:px-6">
          {/* TODO: make it dynamic */}
          <h1 className="text-sm md:text-lg font-bold truncate">News</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="relative hidden sm:block w-40 md:w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 rounded-full h-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
          <UserDropDownMenu />
        </div>
      </div>
    </header>
  );
}
