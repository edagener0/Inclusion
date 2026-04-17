import { createFileRoute } from '@tanstack/react-router';

import { GamesList } from '@/widgets/games/games-list';

export const Route = createFileRoute('/_main/games/')({
  component: GamesList,
});
