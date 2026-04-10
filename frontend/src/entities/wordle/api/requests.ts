import { api } from '@/shared/api/base';

import {
  type WordleGuessResponse,
  type WordleLeaderboard,
  type WordleWord,
  wordleGuessResponseSchema,
  wordleLeaderboardSchema,
  wordleWordSchema,
} from '../model/schema';

export async function getWordleWord(): Promise<WordleWord> {
  const res = await api.get('/wordle/word');
  return wordleWordSchema.parse(res.data);
}

export async function submitGuess(word: string): Promise<WordleGuessResponse> {
  const res = await api.post('/wordle/guess', { word });
  return wordleGuessResponseSchema.parse(res.data);
}

export async function getWordleLeaderboard(): Promise<WordleLeaderboard> {
  const res = await api.get('/wordle/leaderboard');
  return wordleLeaderboardSchema.parse(res.data.results ?? res.data);
}
