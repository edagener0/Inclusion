import { useTranslation } from 'react-i18next';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useWordleGame } from '@/features/wordle-game';

import { WordleBoard, WordleKeyboard, wordleQueries } from '@/entities/wordle';

export function WordleGameContent() {
  const { t } = useTranslation('games', { keyPrefix: 'wordle' });
  const { data } = useSuspenseQuery(wordleQueries.word());

  const { guesses, results, currentGuess, wordLength, isSubmitting, usedLetters, onKeyPress } =
    useWordleGame({ word: data });

  return data.hasWon ? (
    <div className="animate-in fade-in zoom-in mt-8 text-center duration-300">
      <p className="text-xl font-semibold">{t('winMessage')}</p>
      <p className="text-muted-foreground mt-1">{t('comeBackTomorrow')}</p>
    </div>
  ) : (
    <>
      <WordleBoard
        guesses={guesses}
        results={results}
        currentGuess={currentGuess}
        wordLength={wordLength}
      />
      <WordleKeyboard onKey={onKeyPress} usedLetters={usedLetters} disabled={isSubmitting} />
    </>
  );
}
