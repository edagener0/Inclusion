import { z } from 'zod';

export const UserPreviewSchema = z.object({
  id: z.int().positive(),
  username: z.string(),
  avatar: z.httpUrl(),
});

export type UserPreview = z.infer<typeof UserPreviewSchema>;
