import {
  Gamepad2Icon,
  BotIcon,
  ImagesIcon,
  Mail,
  PlusIcon,
  ScrollTextIcon,
  Settings,
  UserIcon,
} from 'lucide-react';

import type { NavItem } from '../model/types';

export const navItems = [
  { icon: ScrollTextIcon, label: 'sideBar.incs', path: '/incs', modal: undefined },
  { icon: ImagesIcon, label: 'sideBar.posts', path: '/posts', modal: undefined },
  { icon: UserIcon, label: 'sideBar.profile', path: '/profile', modal: undefined },
  { icon: Mail, label: 'sideBar.messages', path: '/messages', modal: undefined },
  { icon: Gamepad2Icon, label: 'sideBar.games', path: '/games', modal: undefined },
  { icon: BotIcon, label: 'sideBar.chat-bot', path: '/chat-bot', modal: undefined },
  { icon: Settings, label: 'sideBar.settings', modal: 'user-settings', path: '.' },
  { icon: PlusIcon, label: 'sideBar.newContent', modal: 'create-content', path: '.' },
] as const satisfies NavItem[];
