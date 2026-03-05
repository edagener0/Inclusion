import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { navItems } from '../config/items';

export const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <nav className={`flex flex-col ${mobile ? 'gap-1 px-2' : 'gap-1.5'}`}>
      {navItems.map(item => (
        <Link
          key={item.label}
          to={item.path ?? '.'}
          search={prev => (item.modal ? { ...prev, modal: item.modal } : prev)}
        >
          <Button
            variant={item.modal === 'create-content' ? 'outline' : 'ghost'}
            className={cn(
              'group w-full justify-start gap-3 rounded-lg',

              'text-muted-foreground hover:text-foreground',

              'bg-transparent hover:bg-muted/50',

              'transition-all duration-300 ease-out',

              mobile ? 'h-10 text-sm px-3 font-normal' : 'h-10 text-base px-4 font-semibold',
            )}
          >
            <item.icon
              className={cn(
                'transition-transform duration-300 group-hover:scale-110',
                mobile ? 'h-4 w-4' : 'h-4 w-4 mr-1',
              )}
            />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};
