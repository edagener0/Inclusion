import type { UserPreview } from '@/shared/api';

import avatar from '../assets/bot.png';

export const bot = {
  id: -1,
  username: 'Bot',
  avatar,
} satisfies UserPreview;
