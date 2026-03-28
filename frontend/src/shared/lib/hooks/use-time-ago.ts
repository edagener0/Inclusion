import { useTranslation } from 'react-i18next';

import { timeAgo } from '../utils';

export function useTimeAgo(date: Date | string | number): string {
  useTranslation();

  const dateObj = date instanceof Date ? date : new Date(date);

  return timeAgo(dateObj);
}
