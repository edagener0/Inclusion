import z from 'zod';

export const AccountPrivacySchema = z.object({
  isPrivate: z.boolean(),
});

export type AccountPrivacy = z.infer<typeof AccountPrivacySchema>;
