import { QueryClient } from '@tanstack/react-query';

const ONE_MINUTE_MS = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
