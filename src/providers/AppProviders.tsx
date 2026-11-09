import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from './queryClient';
import { GlobalStyle } from '@/styles/GlobalStyle';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      {children}
    </QueryClientProvider>
  );
}
