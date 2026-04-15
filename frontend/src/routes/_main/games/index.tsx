import { createFileRoute } from '@tanstack/react-router';

import { GamesList } from '@/widgets/games';

export const Route = createFileRoute('/_main/games/')({
  component: GamesList,
});
