import { useTranslation } from 'react-i18next';

import { Monitor, Moon, Palette, Sun } from 'lucide-react';

import { useTheme } from '@/shared/lib/theme';
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';

export function ThemeSwitcherDropDownMenuSub() {
  const { setTheme } = useTheme();
  const { t } = useTranslation('common', { keyPrefix: 'theme' });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Palette className="mr-2 h-4 w-4" />
        {t('title')}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            {t('dark')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            {t('light')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Monitor className="mr-2 h-4 w-4" />
            {t('system')}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
