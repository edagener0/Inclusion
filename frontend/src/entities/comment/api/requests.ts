import { api } from '@/shared/api';
import type { PaginatedResponse } from '@/shared/api';

import {
  type Comment,
  CommentSchema,
  type CreateCommentDTO,
  type FetchCommentsDTO,
} from '../model/types';

export async function createComment({ commentary, entityId, entityType }: CreateCommentDTO) {
  await api.post(`/${entityType}/${entityId}/comments`, { commentary });
}

export async function deleteComment(id: number) {
  await api.delete(`/comments/${id}`);
}

export async function fetchComments({
  entityId,
  entityType: entity,
  page,
}: FetchCommentsDTO): Promise<{ data: Comment[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<Comment>>(`/${entity}/${entityId}/comments`, {
    params: { page },
  });

  return {
    data: CommentSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}
