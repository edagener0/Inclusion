import z from 'zod';

export const UpdateFullNameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export type UpdateFullName = z.infer<typeof UpdateFullNameSchema>;
