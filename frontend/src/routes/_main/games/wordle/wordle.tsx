import { createFileRoute } from '@tanstack/react-router';

import { WordleGame } from '@/features/wordle-game';

export const Route = createFileRoute('/_main/games/wordle/wordle')({
  component: WordleGame,
});
