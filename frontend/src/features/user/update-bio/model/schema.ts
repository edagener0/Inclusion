import z from 'zod';

export const updateBioSchema = z.object({
  biography: z.string(),
});

export type UpdateBio = z.infer<typeof updateBioSchema>;
