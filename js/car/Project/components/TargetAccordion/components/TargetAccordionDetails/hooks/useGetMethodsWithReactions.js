import { useMemo } from 'react';
import { useGetMethods } from './useGetMethods';
import { useGetReactions } from './useGetReactions';

export const useGetMethodsWithReactions = targetId => {
  const { data: methods, isLoading: isLoadingMethods, isError: isErrorMethods } = useGetMethods(targetId);
  const reactionsResults = useGetReactions(methods);

  const isLoading = isLoadingMethods || reactionsResults.some(result => result.isLoading);
  const isError = isErrorMethods || reactionsResults.some(result => result.isError);

  const methodsWithReactions = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return (
      methods
        ?.map((method, index) => ({ method, reactionResult: reactionsResults[index] }))
        .filter(({ reactionResult }) => reactionResult.isSuccess)
        .map(({ method, reactionResult }) => ({ method, reactions: reactionResult.data })) || []
    );
  }, [isLoading, methods, reactionsResults]);

  return { isLoading, isError, methodsWithReactions };
};
