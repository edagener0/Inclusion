import { z } from 'zod';

// Schema para metadados da palavra (GET /wordle/word)
export const wordleWordSchema = z.object({
  length: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type WordleWord = z.infer<typeof wordleWordSchema>;

// Schema para a resposta do palpite (POST /wordle/guess)
export const wordleGuessResponseSchema = z.object({
  detail: z.string(),
  correct: z.boolean(),
  guesses: z.number(),
  diff: z.string(),
});

export type WordleGuessResponse = z.infer<typeof wordleGuessResponseSchema>;

// Schema para o erro de palpite
export const wordleGuessErrorSchema = z.object({
  detail: z.string(),
});

export type WordleGuessError = z.infer<typeof wordleGuessErrorSchema>;

// Schema para o leaderboard (GET /wordle/leaderboard)
export const wordleLeaderboardUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url(),
  current_wordle_streak: z.number(),
  max_wordle_streak: z.number(),
});

export type WordleLeaderboardUser = z.infer<typeof wordleLeaderboardUserSchema>;

// Schema para a lista de resultados do leaderboard
export const wordleLeaderboardSchema = z.array(wordleLeaderboardUserSchema);

export type WordleLeaderboard = z.infer<typeof wordleLeaderboardSchema>;
