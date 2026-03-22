import z from 'zod';

export const updateBioSchema = z.object({
  isPrivate: z.boolean(),
});

export type UpdateBio = z.infer<typeof updateBioSchema>;
