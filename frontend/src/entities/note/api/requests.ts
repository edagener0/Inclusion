import { api } from '@/shared/api/base';
import type { PaginatedResponse } from '@/shared/api/types';

import { type Note, NoteSchema } from '../model/types';

export async function getNotes(): Promise<Note[]> {
  const res = await api.get<PaginatedResponse<Note>>('/notes');
  return NoteSchema.array().parse(res.data.results);
}

export async function createNote(content: string): Promise<Note> {
  const res = await api.post<Note>('/notes', { content });
  return NoteSchema.parse(res.data);
}

export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}`);
}
