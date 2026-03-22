import z from 'zod';

export const CommentSchema = z.object({
  id: z.int(),
  user: z.object({
    id: z.int(),
    username: z.string(),
    avatar: z.url(),
  }),
  commentary: z.string(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Comment = z.infer<typeof CommentSchema>;

export type CreateCommentDTO = {
  entityType: string;
  entityId: number;
  commentary: string;
};

export type FetchCommentsDTO = {
  entityType: string;
  entityId: number;
  page: number;
};
