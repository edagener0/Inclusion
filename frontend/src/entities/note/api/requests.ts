import { api } from '@/shared/api/base';

import type { Note } from '../model/types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getNotes = async () => {
  const res = await api.get<PaginatedResponse<Note>>('/notes');
  return res.data.results;
};

export const createNote = async (content: string) => {
  const res = await api.post<Note>('/notes', { content });
  return res.data;
};

export const deleteNote = async (noteId: number) => {
  await api.delete(`/notes/${noteId}`);
};
