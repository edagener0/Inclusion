import { type TFunction } from 'i18next';
import { z } from 'zod';

export const createSignUpSchema = (t: TFunction<'auth', 'sign-up'>) =>
  z
    .object({
      email: z.email(),
      password: z.string().min(1),
      confirmPassword: z.string().min(1),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      username: z
        .string()
        .min(1)
        .max(150)
        .regex(/^[A-Za-z0-9@.+\-_]+$/, {
          message: t('fields.username.errors.regex'),
        }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('fields.password.errors.missmatch'),
      path: ['confirmPassword'],
    });

export type SignUp = z.infer<ReturnType<typeof createSignUpSchema>>;
