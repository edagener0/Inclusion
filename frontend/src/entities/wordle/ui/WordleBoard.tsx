import type { LetterStatus } from '../lib/parse-diff';
import { WordleTile } from './WordleTitle';

type Props = {
  guesses: string[];
  results: LetterStatus[][];
  currentGuess: string;
  wordLength: number;
};

export function WordleBoard({ guesses, results, currentGuess, wordLength }: Props) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-col items-center gap-2">
        {guesses.map((guess, i) => (
          <div key={i} className="flex w-full max-w-full justify-center gap-2 overflow-hidden">
            {guess.split('').map((letter, j) => (
              <WordleTile key={j} letter={letter} status={results[i]?.[j]} />
            ))}
          </div>
        ))}

        <div className="flex w-full max-w-full justify-center gap-2 overflow-hidden">
          {Array.from({ length: wordLength }).map((_, i) => {
            const letter = currentGuess[i];
            return <WordleTile key={i} letter={letter} status={letter ? 'active' : 'empty'} />;
          })}
        </div>
      </div>
    </div>
  );
}
