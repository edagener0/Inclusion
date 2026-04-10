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
        <p className="text-muted-foreground mt-4">A carregar o jogo de hoje...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Wordle</h1>
        <p className="text-muted-foreground">
          Adivinha a palavra de hoje em {maxTries} tentativas.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: '/games/wordle/leaderboard' })}
        >
          Ver Leaderboard
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
            {guesses.length < maxTries ? 'Parabéns!' : 'Fim de jogo!'}
          </p>
          <p className="text-muted-foreground mt-1">Volta amanhã para uma nova palavra.</p>
        </div>
      )}
    </div>
  );
}
