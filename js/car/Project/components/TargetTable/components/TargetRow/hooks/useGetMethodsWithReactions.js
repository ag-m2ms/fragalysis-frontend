import { useGetMethods } from './useGetMethods';
import { useGetReactions } from './useGetReactions';

export const useGetMethodsWithReactions = (targetId, enabled) => {
  const { data: methods, isLoading: isLoadingMethods, isError: isErrorMethods } = useGetMethods(targetId, enabled);
  const reactionsResults = useGetReactions(methods, enabled);

  const isLoading = isLoadingMethods || reactionsResults.some(result => result.isLoading);
  const isError = isErrorMethods || reactionsResults.some(result => result.isError);

  const methodsWithReactions =
    !isLoading &&
    (methods
      ?.map((method, index) => ({ method, reactionResult: reactionsResults[index] }))
      .filter(({ reactionResult }) => reactionResult.isSuccess)
      .map(({ method, reactionResult }) => ({ method, reactions: reactionResult.data })) ||
      []);

  return { data: methodsWithReactions, isLoading, isError };
};
