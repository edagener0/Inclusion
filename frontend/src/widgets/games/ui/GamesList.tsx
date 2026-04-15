import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';
import type { ParseKeys } from 'i18next';
import { Gamepad2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

type GameConfig = {
  id: string;
  slug: string;
  iconLetter: string;
  titleKey: ParseKeys<'games'>;
  descriptionKey: ParseKeys<'games'>;
  preview: React.ReactNode;
};

const GAMES_CONFIG: GameConfig[] = [
  {
    id: 'wordle',
    slug: '/games/wordle/wordle',
    iconLetter: 'W',
    titleKey: 'games.wordle',
    descriptionKey: 'games.wordleDescription',
    preview: (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-6 w-6 rounded border" />
        ))}
      </div>
    ),
  },
];

export function GamesList() {
  const { t } = useTranslation(['games']);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Gamepad2 className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold">{t('games:games.title')}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GAMES_CONFIG.map((game) => (
          <Link key={game.id} to={game.slug}>
            <Card className="hover:ring-primary/50 group cursor-pointer transition-all">
              <CardHeader>
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <span className="text-primary text-2xl font-bold">{game.iconLetter}</span>
                </div>
                <CardTitle>{t(game.titleKey)}</CardTitle>
                <CardDescription>{t(game.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent>{game.preview}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
