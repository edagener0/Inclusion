import { createFileRoute } from '@tanstack/react-router';

import { WordleLeaderboard } from '@/widgets/games/ui/WordleLeaderboard';

export const Route = createFileRoute('/_main/games/wordle/leaderboard')({
  component: WordleLeaderboard,
});
