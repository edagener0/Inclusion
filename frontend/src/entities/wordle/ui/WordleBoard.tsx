import { type WordleBoardProps } from '../../../features/wordle-game/model/types';
import { WordleTile } from './WordleTile';

export function WordleBoard({
  guesses,
  results,
  currentGuess,
  wordLength,
  maxTries,
}: WordleBoardProps) {
  const emptyRowsCount = Math.max(0, maxTries - guesses.length - 1);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 1. Linhas já submetidas */}
      {guesses.map((guess, i) => (
        <div key={i} className="flex gap-2">
          {guess.split('').map((letter, j) => (
            <WordleTile key={j} letter={letter} status={results[i]?.[j]} />
          ))}
        </div>
      ))}

      {/* 2. Linha atual (onde o utilizador está a escrever) */}
      {guesses.length < maxTries && (
        <div className="flex gap-2">
          {Array.from({ length: wordLength }).map((_, i) => {
            const letter = currentGuess[i];
            return <WordleTile key={i} letter={letter} status={letter ? 'active' : 'empty'} />;
          })}
        </div>
      )}

      {/* 3. Linhas vazias restantes */}
      {Array.from({ length: emptyRowsCount }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: wordLength }).map((_, j) => (
            <WordleTile key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}
