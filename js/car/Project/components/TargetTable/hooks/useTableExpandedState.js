import { useState } from 'react';

export const useTableExpandedState = () => {
  const [expandedState, setExpandedState] = useState({});

  const updateExpandedState = (rowId, expanded) => {
    setExpandedState(prevState => ({
      ...prevState,
      [rowId]: expanded
    }));
  };

  return { expandedState, updateExpandedState };
};
