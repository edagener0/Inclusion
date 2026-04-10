import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

import { useWordleGame } from '../model/hook';
import { WordleBoard } from './WordleBoard';
import { WordleKeyboard } from './WordleKeyBoard';

export function WordleGame() {
  const navigate = useNavigate();
  const {
    guesses,
    results,
    currentGuess,
    wordLength,
    maxTries,
    isGameOver,
    isSubmitting,
    isLoading,
    usedLetters,
    onKeyPress,
  } = useWordleGame();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Spinner className="h-12 w-12" />
        <p className="text-muted-foreground mt-4">Loading today&apos;s game...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Wordle</h1>
        <p className="text-muted-foreground">Guess today&apos;s word in {maxTries} tries.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: '/games/wordle/leaderboard' })}
        >
          View Leaderboard
        </Button>
      </div>

      <WordleBoard
        guesses={guesses}
        results={results}
        currentGuess={currentGuess}
        wordLength={wordLength}
        maxTries={maxTries}
      />

      <WordleKeyboard
        onKey={onKeyPress}
        usedLetters={usedLetters}
        disabled={isGameOver || isSubmitting}
      />

      {isGameOver && (
        <div className="animate-in fade-in zoom-in mt-8 text-center duration-300">
          <p className="text-xl font-semibold">
            {guesses.length < maxTries ? 'Congratulations!' : 'Game Over!'}
          </p>
          <p className="text-muted-foreground mt-1">Come back tomorrow for a new word.</p>
        </div>
      )}
    </div>
  );
}
