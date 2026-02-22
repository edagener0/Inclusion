import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { navItems } from '../config/items';

// variant={item.active ? 'secondary' : 'ghost'}
export const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <nav className={`flex flex-col ${mobile ? 'gap-0.5 px-2' : 'gap-1'}`}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          asChild
          variant="ghost"
          className={cn(
            'justify-start gap-4 transition-all rounded-xl w-full', // Добавил w-full на всякий случай
            mobile ? 'h-11 text-base px-3 font-normal' : 'h-12 text-lg px-4 font-medium',
          )}
        >
          <Link to={item.path}>
            <item.icon className={mobile ? 'h-5 w-5' : 'h-6 w-6'} />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
};
