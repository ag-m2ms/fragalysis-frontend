import React, { forwardRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '../LoadingSpinner';
import { Alert, AlertTitle } from '@material-ui/lab';
import { LegacySuspenseWithBoundary } from './components/LegacySuspenseWithBoundaries';

export const SuspenseWithBoundary = forwardRef(({ children, SuspenseProps = {}, ErrorBoundaryProps = {} }, ref) => {
  return (
    <ErrorBoundary
      ref={ref}
      onError={error => console.log(error.message)}
      fallbackRender={({ error }) => {
        return (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error.message}
          </Alert>
        );
      }}
      {...ErrorBoundaryProps}
    >
      <Suspense fallback={<LoadingSpinner />} {...SuspenseProps}>
        <LegacySuspenseWithBoundary>{children}</LegacySuspenseWithBoundary>
      </Suspense>
    </ErrorBoundary>
  );
});

SuspenseWithBoundary.displayName = 'SuspenseWithBoundary';
