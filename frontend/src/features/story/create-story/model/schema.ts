import { type TFunction } from 'i18next';
import { z } from 'zod';

export const createStorySchema = (t: TFunction<'common'>) =>
  z.object({
    file: z.instanceof(File, { message: t('errors.file.required') }),
  });

export type CreateStory = z.infer<ReturnType<typeof createStorySchema>>;
