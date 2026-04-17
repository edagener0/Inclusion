import { type LetterStatus } from '@/entities/wordle/';

import { WordleKey } from './WordleKey';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
];

interface WordleKeyboardProps {
  onKey: (key: string) => void;
  usedLetters: Record<string, LetterStatus>;
  disabled?: boolean;
}

export function WordleKeyboard({ onKey, usedLetters, disabled }: WordleKeyboardProps) {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-2">
      {ROWS.map((row, i) => (
        <div key={i} className="flex w-full justify-center gap-1.5">
          {row.map((key) => (
            <WordleKey
              key={key}
              value={key}
              status={usedLetters[key] || 'unused'}
              onClick={onKey}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
