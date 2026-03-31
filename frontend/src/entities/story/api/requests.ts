import { type PaginatedResponse, api } from '@/shared/api';

import { type UserStories, UserStoriesSchema } from '../model/schema';

export async function fetchStories(
  page: number,
): Promise<{ data: UserStories[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/stories', { params: { page } });

  return {
    data: UserStoriesSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}

export async function createStory(file: File) {
  await api.post(
    '/stories',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export async function deleteStory(id: number) {
  await api.delete(`/stories/${id}`);
}
