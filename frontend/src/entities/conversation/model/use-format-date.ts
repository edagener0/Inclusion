import { useTranslation } from 'react-i18next';

import { formatConversationDate } from '../lib/format-date';

export function useFormatDate(date: Date | string | number): string {
  useTranslation();

  const dateObj = date instanceof Date ? date : new Date(date);

  return formatConversationDate(dateObj);
}
