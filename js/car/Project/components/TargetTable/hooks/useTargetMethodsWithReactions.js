import { useCallback, useState } from 'react';

export const useTargetMethodsWithReactions = () => {
  const [targetMethodsWithReaction, setTargetMethodsWithReaction] = useState({});

  const updateTargetMethodsWitReactions = useCallback((targetId, methodAndReactions) => {
    setTargetMethodsWithReaction(prevState => ({
      ...prevState,
      [targetId]: methodAndReactions
    }));
  }, []);

  return { targetMethodsWithReaction, updateTargetMethodsWitReactions };
};
