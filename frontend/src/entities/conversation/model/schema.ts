import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const ConversationSchema = z.object({
  id: z.int().positive(),
  user: UserPreviewSchema,
  lastMessage: z.string(),
  createdAt: z.coerce.date(),
});
export type Conversation = z.infer<typeof ConversationSchema>;

export const MessageSchema = z.object({
  id: z.int().positive(),
  content: z.string(),
  user: UserPreviewSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Message = z.infer<typeof MessageSchema>;
