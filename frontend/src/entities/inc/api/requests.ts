import { type PaginatedResponse, api } from '@/shared/api';

import { type Inc, IncSchema } from '../model/types';

export async function getInc(id: number): Promise<Inc> {
  const result = await api.get(`/incs/${id}`);
  return IncSchema.parse(result.data);
}

export async function fetchIncs(page: number): Promise<{ data: Inc[]; hasNextPage: boolean }> {
  const response = await api.get<PaginatedResponse<unknown>>('/incs', { params: { page } });

  return {
    data: IncSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}

export async function createInc(content: string) {
  await api.post('/incs', { content });
}

export async function deleteInc(id: number) {
  await api.delete(`/incs/${id}`);
}
