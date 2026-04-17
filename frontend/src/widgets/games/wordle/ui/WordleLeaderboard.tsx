import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Trophy } from 'lucide-react';

import { Spinner } from '@/shared/ui/spinner';

import { WordleLeaderboardContent } from './WordleLeaderboardContent';

export function WordleLeaderboard() {
  const { t } = useTranslation(['games', 'common']);

  return (
    <section className="mx-auto mt-8 w-full max-w-2xl px-4">
      <header className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-3xl font-bold tracking-tight">
            {t('games:wordle.leaderboard.title')}
          </h2>
        </div>
        <p className="text-muted-foreground">{t('games:wordle.leaderboard.bestPlayers')}</p>
      </header>

      <div className="w-full">
        <Suspense
          fallback={
            <div className="flex min-h-64 flex-col items-center justify-center">
              <Spinner className="h-12 w-12" />
              <p className="text-muted-foreground mt-4">{t('common:actions.loading')}</p>
            </div>
          }
        >
          <WordleLeaderboardContent />
        </Suspense>
      </div>
    </section>
  );
}
