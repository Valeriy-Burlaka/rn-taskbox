import React, { useEffect, useState } from 'react';

import { TaskData, TaskStates } from 'components/Task';

import PureTaskList from './components/PureTaskList';

function getTasks():{[key: string]: TaskData} {
  const result = {
    '1': {
      id: '1',
      title: 'Something',
      state: TaskStates.TASK_INBOX,
    },
    '2': {
      id: '2',
      title: 'Something more',
      state: TaskStates.TASK_INBOX,
    },
    '3': {
      id: '3',
      title: 'Something else',
      state: TaskStates.TASK_INBOX,
    },
    '4': {
      id: '4',
      title: 'Something again',
      state: TaskStates.TASK_INBOX,
    },
    '5': {
      id: '5',
      title: 'Something again',
      state: TaskStates.TASK_PINNED,
    },
    '6': {
      id: '6',
      title: 'Something again',
      state: TaskStates.TASK_ARCHIVED,
    },
  };

  return result;
}

export default function TaskList() {
  
  const [tasks, setTasks] = useState<ReturnType<typeof getTasks>>({});

  useEffect(() => {
    const tasks = getTasks();

    setTasks(tasks);
  }, []);

  const tasksMapToArray = (tasks: ReturnType<typeof getTasks>) => {
    return Object.values(tasks);
  }
  
  const onPinTask = (id: string) => ({

  });

  const onArchiveTask = (id: string) => ({

  });

  return (
    <PureTaskList
      loading={false}
      onArchiveTask={onArchiveTask}
      onPinTask={onPinTask}
      tasks={Object.values(tasks)}
    />
    );
}
