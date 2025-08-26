import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProviderProps } from '@gear-js/react-hooks';

const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 0, staleTime: Infinity } },
});

function IndexerProvider({ children }: ProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export { IndexerProvider };


