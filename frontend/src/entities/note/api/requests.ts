import { api } from "@/shared/api/base";
import type { Note } from "../model/types";

export const getNotes = async () => {
    const res = await api.get<Note[]>('/notes');
    return res.data;
};

export const createNote = async (content: string) => {
    const res = await api.post<Note>('/notes', { content });
    return res.data;
};

export const deleteNote = async (noteId: number) => {
    await api.delete(`/notes/${noteId}`);
}