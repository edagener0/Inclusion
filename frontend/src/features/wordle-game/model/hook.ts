import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  type LetterStatus,
  WORDLE_CONFIG,
  parseDiff,
  submitGuess,
  wordleQueries,
} from '@/entities/wordle';

export function useWordleGame() {
  const queryClient = useQueryClient();

  // 1. Obter metadados da palavra de hoje (comprimento e dificuldade)
  const { data: wordMetadata, isLoading: isLoadingWord } = useQuery(wordleQueries.word());

  // 2. Estados locais do jogo
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const wordLength = wordMetadata?.length || 5;
  const maxTries = WORDLE_CONFIG.MAX_TRIES;

  // 3. Mutação para submeter o palpite ao backend
  const { mutate: guess, isPending: isSubmitting } = useMutation({
    mutationFn: submitGuess,
    onSuccess: data => {
      // Adicionar a palavra escrita à lista de tentativas
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      // Traduzir a string de "diff" (+, *, -) para estados que a UI entende
      const newResult = parseDiff(data.diff);
      setResults([...results, newResult]);

      // Limpar o campo de escrita para a próxima tentativa
      setCurrentGuess('');

      // Verificar condições de fim de jogo
      if (data.correct) {
        setIsGameOver(true);
        toast.success('Incrível! Acertaste na palavra!');
        // Atualizar o leaderboard já que o utilizador ganhou
        queryClient.invalidateQueries({ queryKey: wordleQueries.leaderboard().queryKey });
      } else if (newGuesses.length >= maxTries) {
        setIsGameOver(true);
        toast.error('Game Over! Esgotaste as tuas tentativas.');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao submeter palpite.');
    },
  });

  // 4. Função principal de processamento de teclas
  const onKeyPress = useCallback(
    (key: string) => {
      if (isGameOver || isSubmitting) return;

      const upperKey = key.toUpperCase();

      if (upperKey === 'ENTER') {
        if (currentGuess.length !== wordLength) {
          toast.warning(`A palavra deve ter ${wordLength} letras`);
          return;
        }
        guess(currentGuess);
      } else if (upperKey === 'DELETE' || upperKey === 'BACKSPACE') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(upperKey)) {
        if (currentGuess.length < wordLength) {
          setCurrentGuess(prev => (prev + upperKey).toLowerCase());
        }
      }
    },
    [currentGuess, wordLength, isGameOver, isSubmitting, guess],
  );

  // 5. Listener para o teclado físico do computador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o utilizador estiver a usar atalhos (Ctrl+C, etc)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      onKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  // 6. Mapear o estado de cada letra para colorir o teclado virtual
  // Prioridade: correct (verde) > present (amarelo) > absent (cinza)
  const usedLetters = results.reduce(
    (acc, row, rowIndex) => {
      const word = guesses[rowIndex];
      row.forEach((status, i) => {
        const letter = word[i].toUpperCase();
        if (status === 'correct') {
          acc[letter] = 'correct';
        } else if (status === 'present' && acc[letter] !== 'correct') {
          acc[letter] = 'present';
        } else if (status === 'absent' && !acc[letter]) {
          acc[letter] = 'absent';
        }
      });
      return acc;
    },
    {} as Record<string, LetterStatus>,
  );

  return {
    guesses,
    results,
    currentGuess,
    wordLength,
    maxTries,
    isLoading: isLoadingWord,
    isSubmitting,
    isGameOver,
    usedLetters,
    onKeyPress,
  };
}
