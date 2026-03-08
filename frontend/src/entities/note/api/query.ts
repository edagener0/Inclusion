import { queryOptions } from "@tanstack/react-query";
import { getNotes } from './requests';

export const noteQueries = {
    all: () => ['/notes'] as const,
    list: () =>
        queryOptions({
            queryKey: [...noteQueries.all(), 'list'],
            queryFn: getNotes,
            staleTime: 5 * 60 * 1000,
        }),
};