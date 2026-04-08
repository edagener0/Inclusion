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
    label: 'post.label',
    description: 'post.description',
    icon: ImagesIcon,
    modal: 'create-post',
  },
  {
    id: 'inc',
    label: 'inc.label',
    description: 'inc.description',
    icon: MessageCirclePlusIcon,
    modal: 'create-inc',
  },
  {
    id: 'story',
    label: 'story.label',
    description: 'story.description',
    icon: HistoryIcon,
    modal: 'create-story',
  },
] as const satisfies CreateContentItem[];
