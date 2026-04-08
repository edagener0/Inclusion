import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 401
      ) {
        return;
      }

      if (error instanceof z.ZodError) {
        console.error('Invalid data structure (Zod):', error.issues);
        toast.error('Data error', {
          description: 'Server returned an unexpected data structure format.',
        });
        return;
      }

      toast.error('Error occurred', { description: error.message });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error('Error occurred', { description: error.message });
    },
  }),
});
