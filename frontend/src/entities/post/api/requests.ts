import { api } from '@/shared/api/base';

import { type Post, PostSchema } from '../model/types';

export async function fetchPostById(id: number): Promise<Post> {
  const result = await api.get<Post>(`/posts/${id}`);
  return PostSchema.parse(result.data);
}

export async function fetchPosts(page: number): Promise<Post[]> {
  const results = await api.get<Post[]>('/posts', { params: { page } });
  return PostSchema.array().parse(results.data);
}
