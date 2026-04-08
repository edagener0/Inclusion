import { type LetterStatus } from '@/entities/wordle/lib/parse-diff';

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
    <div className="flex flex-col gap-2 items-center w-full max-w-md mx-auto mt-8">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center w-full">
          {row.map(key => (
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
