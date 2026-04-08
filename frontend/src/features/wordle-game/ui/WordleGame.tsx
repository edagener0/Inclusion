import { useWordleGame } from '../model/hook';
import { WordleBoard } from './WordleBoard';
import { WordleKeyboard } from './WordleKeyBoard';
import { Spinner } from '@/shared/ui/spinner';

export function WordleGame() {
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="w-12 h-12" />
        <p className="mt-4 text-muted-foreground">A carregar o jogo de hoje...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Wordle</h1>
        <p className="text-muted-foreground">Adivinha a palavra de hoje em {maxTries} tentativas.</p>
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
        <div className="mt-8 text-center animate-in fade-in zoom-in duration-300">
          <p className="text-xl font-semibold">
            {guesses.length < maxTries ? 'Parabéns!' : 'Fim de jogo!'}
          </p>
          <p className="text-muted-foreground mt-1">
            Volta amanhã para uma nova palavra.
          </p>
        </div>
      )}
    </div>
  );
}