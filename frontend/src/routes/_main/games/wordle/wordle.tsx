import { createFileRoute } from '@tanstack/react-router';

import { WordleGame } from '@/widgets/games/ui/WordleGame';

export const Route = createFileRoute('/_main/games/wordle/wordle')({
  component: WordleGame,
});
