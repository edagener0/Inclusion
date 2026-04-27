import { useSuspenseQuery } from '@tanstack/react-query';

import { sessionQueries } from '../api/queries';
import type { Session } from './schema';

export function useSession(): Session {
  const { data: session } = useSuspenseQuery(sessionQueries.me());
  return session;
}
