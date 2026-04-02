import { isAxiosError } from 'axios';

import { type PaginatedResponse, type UserPreview, UserPreviewSchema, api } from '@/shared/api';

export async function getSentById(id: number): Promise<UserPreview | null> {
  try {
    const result = await api.get(`/friends/sent/${id}`);
    return UserPreviewSchema.parse(result.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status >= 400 && status < 500) return null;
    }

    throw error;
  }
}

export async function getRequestById(id: number): Promise<UserPreview> {
  const result = await api.get(`/friends/received/${id}`);
  return UserPreviewSchema.parse(result.data);
}

export async function fetchRequests(
  page: number,
): Promise<{ data: UserPreview[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/friends/requests', {
    params: { page },
  });

  return {
    data: UserPreviewSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}
