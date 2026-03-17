import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/api/base';

interface Args {
  endpoint: string;
  isLiked: boolean;
}

export function useToggleLikeMutation() {
  return useMutation({
    mutationFn: async ({ endpoint, isLiked }: Args) => {
      if (isLiked) {
        const response = await api.delete(endpoint);
        return response.data;
      } else {
        const response = await api.post(endpoint);
        return response.data;
      }
    },
  });
}
