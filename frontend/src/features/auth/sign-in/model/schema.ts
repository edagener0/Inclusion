import { z } from 'zod';

export const SignInSchema = z.object({
  username: z.string(),
  password: z.string().min(1),
});
export type SignIn = z.infer<typeof SignInSchema>;
