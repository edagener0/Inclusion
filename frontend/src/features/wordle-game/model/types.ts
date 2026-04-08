import { type LetterStatus } from '@/entities/wordle/lib/parse-diff';

export interface WordleTileProps {
  letter?: string;
  status?: LetterStatus | 'empty' | 'active';
}

export interface WordleKeyProps {
  value: string;
  status?: LetterStatus | 'unused';
  onClick: (key: string) => void;
  disabled?: boolean;
}

export interface WordleBoardProps {
  guesses: string[];
  results: LetterStatus[][];
  currentGuess: string;
  wordLength: number;
  maxTries: number;
}
