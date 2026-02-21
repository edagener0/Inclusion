export const userQueryKeys = {
  all: ['users'] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detailByUsername: (username: string) => [...userQueryKeys.details(), username] as const,
};
