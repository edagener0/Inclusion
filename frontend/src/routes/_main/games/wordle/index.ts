import { createFileRoute } from '@tanstack/react-router';

import { WordleGame } from '@/widgets/games/wordle';

export const Route = createFileRoute('/_main/games/wordle/')({
  component: WordleGame,
});
