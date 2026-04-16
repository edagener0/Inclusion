import { z } from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const WordleWordSchema = z.object({
  gameId: z.int().positive(),
  length: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  hasWon: z.boolean(),
});
export type WordleWord = z.infer<typeof WordleWordSchema>;

export const WordleGuessResponseSchema = z.object({
  detail: z.string(),
  correct: z.boolean(),
  guesses: z.number(),
  diff: z.string(),
});
export type WordleGuessResponse = z.infer<typeof WordleGuessResponseSchema>;

export const WordleLeaderboardUserSchema = UserPreviewSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  currentWordleStreak: z.number(),
  maxWordleStreak: z.number(),
});
export type WordleLeaderboardUser = z.infer<typeof WordleLeaderboardUserSchema>;
