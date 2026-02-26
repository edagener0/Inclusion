import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  icon: LucideIcon;
  label: string;
  path: LinkProps['to'];
};
