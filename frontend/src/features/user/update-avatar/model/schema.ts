import z from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const UpdateAvatarSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please, select a file' })
    .refine(file => file.size > 0, 'File can not be empty')
    .refine(file => file.size <= MAX_FILE_SIZE, `Max file size - 10MB.`)
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Supported formats .jpg, .jpeg, .png and .webp.',
    ),
});

export type UpdateAvatar = z.infer<typeof UpdateAvatarSchema>;
