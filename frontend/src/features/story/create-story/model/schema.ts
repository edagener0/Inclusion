import { z } from 'zod';

export const CreateStorySchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select an image or video.' })
    .refine(file => file.size > 0, 'File is empty.'),
});

export type CreateStory = z.infer<typeof CreateStorySchema>;
