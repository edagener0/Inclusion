import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { CenterSpinner } from '@/shared/ui/spinner';

import { WordleGameContent } from './WordleGameContent';

export function WordleGame() {
  const navigate = useNavigate();
  const { t } = useTranslation(['games', 'common']);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">{t('games:wordle.title')}</h1>
        <Button onClick={() => navigate({ to: '/games/wordle/leaderboard' })}>
          {t('wordle.viewLeaderboard')}
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-100 flex-col items-center justify-center">
            <CenterSpinner className="h-12 w-12" />
            <p className="text-muted-foreground mt-4">{t('common:actions.loading')}</p>
          </div>
        }
      >
        <WordleGameContent />
      </Suspense>
    </div>
  );
}
