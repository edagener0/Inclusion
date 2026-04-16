import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { useWordleGame } from '@/features/wordle-game';

import { wordleQueries } from '@/entities/wordle';
import { WordleBoard } from '@/entities/wordle/ui/WordleBoard';
import { WordleKeyboard } from '@/entities/wordle/ui/WordleKeyboard';

import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export function WordleGame() {
  const navigate = useNavigate();
  const { t } = useTranslation(['games']);
  const { data, isLoading } = useQuery(wordleQueries.word());

  const { guesses, results, currentGuess, wordLength, isSubmitting, usedLetters, onKeyPress } =
    useWordleGame({ wordLength: data?.length ?? 0 });

  console.log(usedLetters);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Spinner className="h-12 w-12" />
        <p className="text-muted-foreground mt-4">{t('wordle.loadingGame')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t('wordle.title')}</h1>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: '/games/wordle/leaderboard' })}
        >
          {t('wordle.viewLeaderboard')}
        </Button>
      </div>

      <WordleBoard
        guesses={guesses}
        results={results}
        currentGuess={currentGuess}
        wordLength={wordLength}
      />

      <WordleKeyboard onKey={onKeyPress} usedLetters={usedLetters} disabled={isSubmitting} />

      {/* {isGameOver && ( */}
      {/*   <div className="animate-in fade-in zoom-in mt-8 text-center duration-300"> */}
      {/*     <p className="text-xl font-semibold"> */}
      {/*       {guesses.length < maxTries ? 'Congratulations!' : 'Game Over!'} */}
      {/*     </p> */}
      {/*     <p className="text-muted-foreground mt-1">{t('wordle.comeBackTomorrow')}</p> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  );
}
