import { z } from 'zod';

export const SignUpSchema = z
  .object({
    email: z.email('Invalid email'),
    password: z.string().min(1),
    confirmPassword: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z
      .string()
      .min(1)
      .max(150, 'Must be 150 characters or fewer')
      .regex(/^[A-Za-z0-9@.+\-_]+$/, 'Letters, digits and @/./+/-/_ only'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords does not match.',
    path: ['confirmPassword'],
  });
export type SignUp = z.infer<typeof SignUpSchema>;
