import React, { createContext, useContext, useState, type Context } from 'react';

import { TaskListModel } from 'model/TaskList';

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
  // taskLists: Map<string, TaskList>;
  taskLists: { [key: string]: TaskListModel };
  setTaskLists: (taskLists: { [key: string]: TaskListModel }) => void;
}

export const DataContext = createContext<AppData | undefined>(undefined);
DataContext.displayName = 'DataContext';

export const useAppData = () => useContextStrict(DataContext);

interface Props {
  children?: React.ReactNode;
}

export const DataProvider = ({ children }: Props) => {
  const [taskLists, setTaskLists] = useState({});

  const contextValue = {
    taskLists,
    setTaskLists,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
};
