import { createFileRoute } from '@tanstack/react-router';

import { WordleLeaderboard } from '@/features/wordle-game';

export const Route = createFileRoute('/_main/games/wordle/leaderboard')({
  component: WordleLeaderboard,
});
