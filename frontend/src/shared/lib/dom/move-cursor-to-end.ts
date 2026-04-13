import type { FocusEvent } from 'react';

export const moveCursorToEnd = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const length = e.currentTarget.value.length;
  e.currentTarget.setSelectionRange(length, length);
};
