import { api } from '@/shared/api';
import type { PaginatedResponse } from '@/shared/api';

import { type Post, PostSchema } from '../model/schema';
import type { CreatePostDTO } from './types';

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

export async function deletePost(id: number) {
  await api.delete(`/posts/${id}`);
}
