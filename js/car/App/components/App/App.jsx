import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../../../Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </>
  );
};
