import React, {
  createContext,
  useContext,
  useState,
  type Context,
} from 'react';
import { produce } from 'immer';

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
 * In-memory tree of lists and tasks. Provides immediate availability of the data
 * when navigating between screens.
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
        setTaskLists(produce(taskLists, (draft) => {
          draft[newList.id] = newList;
        }));
      });
  };

  const deleteList = async (listId: string): Promise<void> => {
    console.log(`Deleting list "${listId}"`);
    return repository
      .deleteList(listId)
      .then(() => {
        setTaskLists(produce(taskLists, (draft) => {
          delete draft[listId];
        }));
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

    // Unfortunately, this won't work with Immer because we only mutate an instance of the class retrieved from the
    // draft tree, so Immer is not able to track these changes (it's designed to work with plain object and arrays)
    // I may want to re-consider my architecture at some point 🤔
    //
    // setTaskLists(produce(taskLists, (draft) => {
    //   draft[list.id] = list;
    // }));

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
