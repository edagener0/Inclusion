import { api } from '@/shared/api';
import type { PaginatedResponse } from '@/shared/api';

import { type Note, NoteSchema } from '../model/types';

export async function getNotes(): Promise<Note[]> {
  const res = await api.get<PaginatedResponse<Note>>('/notes');
  return NoteSchema.array().parse(res.data.results);
}

export async function upsertNote(content: string) {
  await api.post<Note>('/notes', { content });
}

export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}`);
}
