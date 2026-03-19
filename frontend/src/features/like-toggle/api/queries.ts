import { useMutation } from '@tanstack/react-query';

import { api } from '@/shared/api/base';

interface Args {
  entityType: string;
  entityId: number;
  isLiked: boolean;
}

export function useToggleLikeMutation() {
  return useMutation({
    mutationFn: async ({ entityType, entityId, isLiked }: Args) => {
      if (isLiked) {
        const response = await api.delete(`/${entityType}/${entityId}/like`);
        return response.data;
      } else {
        const response = await api.post(`/${entityType}/${entityId}/like`);
        return response.data;
      }
    },
  });
}
