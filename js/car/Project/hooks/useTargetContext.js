import { useContext } from 'react';
import { TargetContext } from '../context/TargetContext';

export const useTargetContext = () => {
  return useContext(TargetContext);
};
