import { api } from '@/shared/api/base';
import type { PaginatedResponse } from '@/shared/api/types';

import { type CreatePostDTO, type Post, PostSchema } from '../model/types';

export async function fetchPostById(id: number): Promise<Post> {
  const result = await api.get<Post>(`/posts/${id}`);
  return PostSchema.parse(result.data);
}

export async function fetchPosts(page: number): Promise<{ data: Post[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/posts', { params: { page } });

  return {
    data: PostSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}

export async function createPost(dto: CreatePostDTO) {
  await api.post('/posts', dto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
