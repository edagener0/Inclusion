import { type TFunction } from 'i18next';
import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const createUpdateAvatarSchema = (t: TFunction<'common'>) =>
  z.object({
    image: z
      .instanceof(File, { message: t('errors.file.required') })
      .refine(file => file.size > 0, t('errors.file.empty'))
      .refine(file => file.size <= MAX_FILE_SIZE, t('errors.file.tooLarge', { max: '10MB' }))
      .refine(
        file => ACCEPTED_IMAGE_TYPES.includes(file.type),
        t('errors.file.invalidFormat', { formats: '.jpg, .jpeg, .png, .webp' }),
      ),
  });

export type UpdateAvatar = z.infer<ReturnType<typeof createUpdateAvatarSchema>>;
