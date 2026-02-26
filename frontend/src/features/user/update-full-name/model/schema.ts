import z from 'zod';

export const updateFullNameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export type UpdateFullName = z.infer<typeof updateFullNameSchema>;
