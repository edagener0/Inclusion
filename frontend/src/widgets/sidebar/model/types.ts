import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

type ExtractModal<T> = T extends { modal?: infer M } ? M : never;

export type NavItem = {
  icon: LucideIcon;
  label: string;
  path?: LinkProps['to'];
  modal?: ExtractModal<LinkProps['search']>;
};
