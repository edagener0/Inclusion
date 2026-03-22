import z from 'zod';

export const SessionSchema = z.object({
  id: z.int(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.url(),
});
export type Session = z.infer<typeof SessionSchema>;

export type SignInDTO = {
  username: string;
  password: string;
};

export type SignUpDTO = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
