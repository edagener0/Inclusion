import z from 'zod';

export const NoteSchema = z.object({
  id: z.int(),
  content: z.string(),
  user: z.object({
    id: z.int(),
    username: z.string(),
    avatar: z.url(),
  }),
  likesCount: z.int(),
  createdAt: z.coerce.date(),
});
export type Note = z.infer<typeof NoteSchema>;
