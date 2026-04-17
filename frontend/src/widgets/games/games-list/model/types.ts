import type { ReactNode } from 'react';

import type { LinkProps } from '@tanstack/react-router';
import type { ParseKeys } from 'i18next';

export type GameConfig = {
  id: string;
  path: LinkProps['to'];
  iconLetter: string;
  titleKey: ParseKeys<'games'>;
  descriptionKey: ParseKeys<'games'>;
  preview: ReactNode;
};
