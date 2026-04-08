import { WORDLE_SYMBOLS } from './constants';

export type LetterStatus = (typeof WORDLE_SYMBOLS)[keyof typeof WORDLE_SYMBOLS];

export function parseDiff(diff: string): LetterStatus[] {
  return diff.split('').map(char => {
    return WORDLE_SYMBOLS[char as keyof typeof WORDLE_SYMBOLS] || 'absent';
  });
}
