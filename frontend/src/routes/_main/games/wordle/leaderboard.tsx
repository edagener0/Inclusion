import { createFileRoute } from '@tanstack/react-router';

import { WordleLeaderboard } from '@/widgets/games/wordle';

export const Route = createFileRoute('/_main/games/wordle/leaderboard')({
  component: WordleLeaderboard,
});
