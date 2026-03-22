import type { LinkProps } from '@tanstack/react-router';
import { type LucideIcon, MessageCirclePlusIcon } from 'lucide-react';

type ExtractModal<T> = T extends { modal?: infer M } ? M : never;

type CreateContentItem = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  modal: ExtractModal<LinkProps['search']>;
};

export const items: CreateContentItem[] = [
  {
    id: 'post',
    label: 'Create a post',
    description: 'Draft a new post, upload images, and share updates with your friends.',
    icon: MessageCirclePlusIcon,
    modal: 'create-post',
  },
];
