import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const SessionSchema = UserPreviewSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;
