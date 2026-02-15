import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { navItems } from '../config/items';

export const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <nav className={`flex flex-col ${mobile ? 'gap-0.5 px-2' : 'gap-1'}`}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant={item.active ? 'secondary' : 'ghost'}
          className={cn(
            'justify-start gap-4 transition-all rounded-xl',
            mobile ? 'h-11 text-base px-3 font-normal' : 'h-12 text-lg px-4 font-medium',
          )}
        >
          <item.icon className={mobile ? 'h-5 w-5' : 'h-6 w-6'} />
          {item.label}
        </Button>
      ))}
    </nav>
  );
};
