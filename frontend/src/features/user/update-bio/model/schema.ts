import z from 'zod';

export const UpdateBioSchema = z.object({
  biography: z.string(),
});

export type UpdateBio = z.infer<typeof UpdateBioSchema>;
