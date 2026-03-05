import type { LinkProps } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';

type ExtractModal<T> = T extends { modal?: infer M } ? M : never;

export type CreateContentItem = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  modal: ExtractModal<LinkProps['search']>;
};

export const items: CreateContentItem[] = [];
