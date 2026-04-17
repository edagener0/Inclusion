import { type PaginatedResponse, type PaginatedReturnData, api } from '@/shared/api';

import {
  type WordleGuessResponse,
  WordleGuessResponseSchema,
  type WordleLeaderboardUser,
  WordleLeaderboardUserSchema,
  type WordleWord,
  WordleWordSchema,
} from '../model/schema';

export async function getWordleWord(): Promise<WordleWord> {
  const response = await api.get('/wordle/word');
  return WordleWordSchema.parse(response.data);
}

export async function submitGuess(word: string): Promise<WordleGuessResponse> {
  const response = await api.post('/wordle/guess', { word });
  return WordleGuessResponseSchema.parse(response.data);
}

export async function getWordleLeaderboard(
  page: number,
): Promise<PaginatedReturnData<WordleLeaderboardUser>> {
  const response = await api.get<PaginatedResponse<WordleLeaderboardUser>>('/wordle/leaderboard', {
    params: { page },
  });
  return {
    data: WordleLeaderboardUserSchema.array().parse(response.data.results),
    hasNextPage: response.data.next !== null,
  };
}
