import { type PaginatedResponse, api } from '@/shared/api';

import { type Story, StorySchema } from '../model/schema';

export async function getStory(id: number): Promise<Story> {
  const result = await api.get(`/stories/${id}`);
  return StorySchema.parse(result.data);
}

export async function fetchStories(page: number): Promise<{ data: Story[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/stories', { params: { page } });

  return {
    data: StorySchema.array().parse(response.data.results),
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
