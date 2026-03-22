export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];
  for (const { unit, seconds } of units) {
    const value = diff / seconds;
    if (Math.abs(value) >= 1) {
      return rtf.format(Math.round(value), unit);
    }
  }
  return 'just now';
}
