import { WordlePreview } from '@/entities/wordle';

import type { GameConfig } from './types';

export const gameList = [
  {
    id: 'wordle',
    path: '/games/wordle',
    iconLetter: 'W',
    titleKey: 'wordle.title',
    descriptionKey: 'wordle.description',
    preview: WordlePreview(),
  },
] as const satisfies GameConfig[];
