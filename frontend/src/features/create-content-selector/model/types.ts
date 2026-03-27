import type { LinkProps } from '@tanstack/react-router';
import { HistoryIcon, ImagesIcon, type LucideIcon, MessageCirclePlusIcon } from 'lucide-react';

type ExtractModal<T> = T extends { modal?: infer M } ? M : never;

type CreateContentItem = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  modal: ExtractModal<LinkProps['search']>;
};

export const items = [
  {
    id: 'post',
    label: 'Create a post',
    description: 'Draft a new post, upload images, and share updates with your friends.',
    icon: ImagesIcon,
    modal: 'create-post',
  },
  {
    id: 'inc',
    label: 'Create an inc',
    description: 'Share a quick thought or short update with your friends.',
    icon: MessageCirclePlusIcon,
    modal: 'create-inc',
  },
  {
    id: 'story',
    label: 'Create a story',
    description: 'Share a moment that disappears after 24 hours.',
    icon: HistoryIcon,
    modal: 'create-story',
  },
] as const satisfies CreateContentItem[];
