import { isAxiosError } from 'axios';

import { type PaginatedResponse, type UserPreview, UserPreviewSchema, api } from '@/shared/api';

export async function getSentById(id: number): Promise<UserPreview | null> {
  try {
    const result = await api.get(`/friends/requests/sent/${id}`);
    return UserPreviewSchema.parse(result.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status >= 400 && status < 500) return null;
    }

    throw error;
  }
}

export async function getReceivedById(id: number): Promise<UserPreview | null> {
  try {
    const result = await api.get(`/friends/requests/received/${id}`);
    return UserPreviewSchema.parse(result.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status >= 400 && status < 500) return null;
    }

    throw error;
  }
}

export async function fetchReceived(
  page: number,
): Promise<{ data: UserPreview[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/friends/requests/received', {
    params: { page },
  });

  return {
    data: UserPreviewSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}
