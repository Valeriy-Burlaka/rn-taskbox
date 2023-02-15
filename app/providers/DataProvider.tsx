import React, {
  createContext,
  useContext,
  useState,
  type Context,
} from 'react';

import { TaskListModel } from 'model/TaskList';
import { TaskListRepository } from 'repository/TaskListRepository';

import { TaskData, TaskDataUpdate } from 'types/task';
import { NewTaskList, TaskList, TaskListUpdate } from 'types';

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
  createList: (listData: NewTaskList) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  updateList: (listId: string, { name, icon, color }: TaskListUpdate) => Promise<void>;
  createTask: (listId: string) => TaskData;
  updateTask: (listId: string, taskId: string, taskData: TaskDataUpdate) => Promise<void>;
  deleteTask: (listId: string, taskId: string) => Promise<void>;
}

export const DataContext = createContext<AppData | undefined>(undefined);
DataContext.displayName = 'DataContext';

export const useAppData = () => useContextStrict(DataContext);

interface Props {
  children?: React.ReactNode;
}

const repository = new TaskListRepository();

/**
 * In-memory tree of lists and tasks. Needed to provide immediate availability of the data
 * when navigating between screens.
 *
 */
export const DataProvider = ({ children }: Props) => {
  const [taskLists, setTaskLists] = useState<AppData['taskLists']>({});

  const _updateTreeAndSyncStorage = (list: TaskListModel) => {
    return repository
      .updateList(list)
      .then(() => {
        setTaskLists({
          ...taskLists,
          [list.id]: list,
        });
      });
  };

  const createList = async (listData: NewTaskList): Promise<void> => {
    console.log('Creating new list:', listData);
    return repository
      .createList(listData)
      .then((newList: TaskListModel) => {
        setTaskLists({
          ...taskLists,
          [newList.id]: newList,
        });
      });
  };

  const deleteList = async (listId: string): Promise<void> => {
    console.log(`Deleting list "${listId}"`);
    return repository
      .deleteList(listId)
      .then(() => {
        const _taskLists = { ...taskLists };
        delete _taskLists[listId];
        setTaskLists(_taskLists);
      });
  };

  const updateList = async (listId: string, { name, icon, color }: TaskListUpdate): Promise<void> => {
    const list = taskLists[listId];
    list.name = name;
    list.icon = icon;
    list.color = color;

    return _updateTreeAndSyncStorage(list);
  };

  const createTask = (listId: string): TaskData => {
    const list = taskLists[listId];
    const newTask = list.createTask();

    // No need to sync with storage here because we've created only a blank task here, which
    // may or may not be edited yet.
    setTaskLists({
      ...taskLists,
      [list.id]: list,
    });

    console.log(`Created new task in list "${listId}":`, newTask);

    return newTask;
  };

  const updateTask = async (listId: string, taskId: string, taskData: TaskDataUpdate): Promise<void> => {
    const list = taskLists[listId];
    list.updateTask(taskId, taskData);

    return _updateTreeAndSyncStorage(list);
  };

  const deleteTask = async (listId: string, taskId: string): Promise<void> => {
    const list = taskLists[listId];
    list.deleteTask(taskId);

    return _updateTreeAndSyncStorage(list);
  }

  const contextValue = {
    taskLists,
    setTaskLists,
    createList,
    deleteList,
    updateList,
    createTask,
    updateTask,
    deleteTask,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
};
