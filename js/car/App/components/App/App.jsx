import { createTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { getTheme } from '../../../../theme';
import Layout from '../../../Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      suspense: true
    }
  }
});

const theme = createTheme({
  ...getTheme(),
  overrides: {
    MuiAccordionSummary: {
      root: {
        '&$expanded': {
          minHeight: 48
        }
      },
      content: {
        margin: 0,
        '&$expanded': {
          margin: 0
        }
      }
    }
  }
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
