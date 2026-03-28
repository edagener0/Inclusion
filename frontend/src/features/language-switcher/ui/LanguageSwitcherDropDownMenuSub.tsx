import { useTranslation } from 'react-i18next';

import { Languages } from 'lucide-react';

import { i18n, supportedLanguages } from '@/shared/config';
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';

export function LanguageSwitcherDropDownMenuSub() {
  const { t } = useTranslation('common');

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages className="mr-2 h-4 w-4" />
        {t('language')}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {supportedLanguages.map(s => (
            <DropdownMenuItem
              key={s.key}
              onClick={() => i18n.changeLanguage(s.key)}
              className="gap-3"
            >
              <img
                src={s.flagUrl}
                alt={`${s.name} flag`}
                className="h-4 w-6 object-cover rounded-sm border"
              />
              <span>{s.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
