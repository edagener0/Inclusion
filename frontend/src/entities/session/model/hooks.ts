import { useQuery } from '@tanstack/react-query';

import { sessionQueries } from '../api/queries';
import type { Session } from './schema';

export function useSession(): Session {
  const { data: session } = useQuery(sessionQueries.me());

  if (!session) {
    throw new Error('useSession must be used within an authorized route');
  }

  return session;
}
