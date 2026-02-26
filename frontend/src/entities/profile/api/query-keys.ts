export const profileQueryKeys = {
  all: ['profiles'] as const,
  byUsername: (username: string) => [...profileQueryKeys.all, username] as const,
};
