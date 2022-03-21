import { useQuery } from 'react-query';
import { removeCeleryTask } from '../../../../../common/stores/celeryTasksStore';
import { axiosGet } from '../../../../../common/utils/axiosFunctions';

export const CeleryTask = ({ task }) => {
  const { id, queryKey, onSuccess, onError } = task;

  useQuery(queryKey, () => axiosGet(queryKey), {
    suspense: false,
    refetchInterval: 1000,
    onSuccess: ({ task_status, ...rest }) => {
      switch (task_status) {
        case 'SUCCESS': {
          removeCeleryTask(id);
          onSuccess(rest);
          break; //traceback
        }
        case 'FAILURE': {
          onError(rest);
          break;
        }
      }
    },
    onError: err => onError(err)
  });

  return null;
};
