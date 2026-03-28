import z from 'zod';

export const UpdateFullNameSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type UpdateFullName = z.infer<typeof UpdateFullNameSchema>;
