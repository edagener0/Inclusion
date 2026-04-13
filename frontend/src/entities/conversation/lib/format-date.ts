import { i18n } from '@/shared/config';

export function formatConversationDate(date: Date): string {
  const now = new Date();
  const currentLang = i18n.language || 'ru';

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat(currentLang, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isYesterday) {
    const rtf = new Intl.RelativeTimeFormat(currentLang, { numeric: 'auto' });
    return rtf.format(-1, 'day');
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return new Intl.DateTimeFormat(currentLang, { weekday: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat(currentLang, {
    day: 'numeric',
    month: 'short',
  }).format(date);
}
