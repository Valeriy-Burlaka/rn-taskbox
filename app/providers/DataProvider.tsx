import React, {
  createContext,
  useContext,
  useState,
  type Context,
} from 'react';

import { TaskListModel } from 'model/TaskList';
import { TaskListRepository } from 'repository/TaskListRepository';
import { TaskData, TaskDataUpdate } from 'types/task';

function useContextStrict<T>(context: Context<T | undefined>): T {
  const contextValue = useContext(context);

  if (contextValue === undefined) {
    throw new Error(
      `${context.displayName || 'Context'} provider not found higher in the component tree.`,
    );
  }

  return contextValue;
}

interface AppData {
  taskLists: { [key: string]: TaskListModel };
  setTaskLists: (taskLists: { [key: string]: TaskListModel }) => void;
  createTask: (listId: string, taskData: TaskData) => void;
  updateTask: (listId: string, taskId: string, taskData: TaskDataUpdate) => void;
  deleteTask: (listId: string, taskId: string) => void;
}

export const DataContext = createContext<AppData | undefined>(undefined);
DataContext.displayName = 'DataContext';

export const useAppData = () => useContextStrict(DataContext);

interface Props {
  children?: React.ReactNode;
}

const repository = new TaskListRepository();

export const DataProvider = ({ children }: Props) => {
  const [taskLists, setTaskLists] = useState<AppData['taskLists']>({});

  const _updateTreeAndSyncStorage = (list: TaskListModel) => {
    setTaskLists({
      ...taskLists,
      [list.id]: list,
    });

    repository.saveList(list);
  }

  const createTask = (listId: string, taskData: TaskData) => {
    console.log(`Creating new task in list "${listId}":`, taskData);
    const list = taskLists[listId];
    list.createTask(taskData);

    setTaskLists({
      ...taskLists,
      [list.id]: list,
    });
  };

  const updateTask = (listId: string, taskId: string, taskData: TaskDataUpdate) => {
    const list = taskLists[listId];
    list.updateTask(taskId, taskData);

    _updateTreeAndSyncStorage(list);
  };

  const deleteTask = (listId: string, taskId: string) => {
    const list = taskLists[listId];
    list.deleteTask(taskId);

    _updateTreeAndSyncStorage(list);
  }

  const contextValue = {
    taskLists,
    setTaskLists,
    createTask,
    updateTask,
    deleteTask,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
};
