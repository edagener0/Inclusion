export const WORDLE_SYMBOLS = {
  '+': 'correct',
  '*': 'present',
  '-': 'absent',
} as const;

export const WORDLE_CONFIG = {
  MAX_TRIES: 6,
} as const;
