import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const ConversationSchema = z
  .object({
    id: z.int().positive(),
    otherUser: UserPreviewSchema,
    lastMessage: z.string(),
    createdAt: z.coerce.date(),
  })
  .transform((s) => ({
    id: s.id,
    user: s.otherUser,
    lastMessage: s.lastMessage,
    createdAt: s.createdAt,
  }));
export type Conversation = z.infer<typeof ConversationSchema>;
