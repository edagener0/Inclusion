import { isAxiosError } from 'axios';

import {
  type PaginatedResponse,
  type PaginatedReturnData,
  type UserPreview,
  UserPreviewSchema,
  api,
} from '@/shared/api';

import { type Friend, FriendSchema } from '../model/schema';

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

export async function fetchReceived(page: number): Promise<PaginatedReturnData<UserPreview>> {
  const response = await api.get<PaginatedResponse<unknown>>('/friends/requests/received', {
    params: { page },
  });

  return {
    data: UserPreviewSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}

export async function fetchFriendsByUsername(
  page: number,
  username: string,
): Promise<PaginatedReturnData<Friend>> {
  const response = await api.get<PaginatedResponse<unknown>>(`/friends/${username}`, {
    params: { page },
  });

  return {
    data: FriendSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}
