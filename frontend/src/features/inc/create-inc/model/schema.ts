import z from 'zod';

import { IncSchema } from '@/entities/inc';

export const CreateIncSchema = IncSchema.pick({ content: true });
export type CreateInc = z.infer<typeof CreateIncSchema>;
