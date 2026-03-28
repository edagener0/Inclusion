import { type TFunction } from 'i18next';
import { z } from 'zod';

export const createPostSchema = (t: TFunction<'common'>) =>
  z.object({
    description: z.string(),
    file: z.instanceof(File, { message: t('errors.mediaFileRequired') }),
  });
export type CreatePost = z.infer<ReturnType<typeof createPostSchema>>;
