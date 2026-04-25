import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { SheetClose } from '@/shared/ui/sheet';

import { navItems } from '../config/items';

export const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => {
  const { t } = useTranslation('common');

  return (
    <nav className={`flex flex-col ${mobile ? 'gap-1 px-2' : 'gap-1.5'}`}>
      {navItems.map((item) => {
        const linkContent = (
          <Link
            key={item.label}
            to={item.path ?? '.'}
            search={(prev) => (item.modal ? { ...prev, modal: item.modal } : prev)}
            className="w-full"
          >
            <Button
              variant={item.modal === 'create-content' ? 'outline' : 'ghost'}
              className={cn(
                'group w-full justify-start gap-3 rounded-lg',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-muted/50 bg-transparent',
                'transition-all duration-300 ease-out',
                mobile ? 'h-10 px-3 text-sm font-normal' : 'h-10 px-4 text-base font-semibold',
              )}
            >
              <item.icon
                className={cn(
                  'transition-transform duration-300 group-hover:scale-110',
                  mobile ? 'h-4 w-4' : 'mr-1 h-4 w-4',
                )}
              />
              {t(item.label)}
            </Button>
          </Link>
        );

        return mobile ? (
          <SheetClose asChild key={item.label}>
            {linkContent}
          </SheetClose>
        ) : (
          linkContent
        );
      })}
    </nav>
  );
};
