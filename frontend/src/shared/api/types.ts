import type { InfiniteData, UndefinedInitialDataInfiniteOptions } from '@tanstack/react-query';

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PaginatedReturnData<T> = { data: T[]; hasNextPage: boolean };

export type AnyInfiniteOptions<TData, TError = Error> = UndefinedInitialDataInfiniteOptions<
  TData,
  TError,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InfiniteData<TData, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
