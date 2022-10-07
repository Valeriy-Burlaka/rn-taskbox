import React, { useEffect, useState } from 'react';

import { TaskData, TaskStates } from 'components/Task';

import PureTaskList from './components/PureTaskList';

function getTasks():{[key: string]: TaskData} {
  const result = {
    '1': {
      id: '1',
      title: 'Add real handlers',
      state: TaskStates.TASK_PINNED,
    },
    '2': {
      id: '2',
      title: '"Create task" button & handler',
      state: TaskStates.TASK_PINNED,
    },
    '3': {
      id: '3',
      title: 'Use local storage to store tasks',
      state: TaskStates.TASK_INBOX,
    },
    '4': {
      id: '4',
      title: 'Error screen',
      state: TaskStates.TASK_INBOX,
    },
    '5': {
      id: '5',
      title: 'Marry styled-components & storybook',
      state: TaskStates.TASK_INBOX,
    },
    '6': {
      id: '6',
      title: 'deploy web?',
      state: TaskStates.TASK_INBOX,
    },
    '7': {
      id: '7',
      title: 'deploy app-dev?',
      state: TaskStates.TASK_INBOX,
    },
    '8': {
      id: '8',
      title: 'Setup storybook on-device',
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
  
  const onPinTask = (id: string) => {
    const t = tasks[id];
    if (t.state === TaskStates.TASK_ARCHIVED) {
      return;
    }

    const tasksCopy = { ...tasks };
    tasksCopy[t.id] = {
      ...t,
      state: t.state === TaskStates.TASK_INBOX ? TaskStates.TASK_PINNED : TaskStates.TASK_INBOX,
    };

    setTasks(tasksCopy);
  };

  const onArchiveTask = (id: string) => {
    const t = tasks[id];
    const tasksCopy = { ...tasks };
    tasksCopy[t.id] = {
      ...t,
      state: t.state === TaskStates.TASK_INBOX ? TaskStates.TASK_ARCHIVED : TaskStates.TASK_INBOX,
    };

    setTasks(tasksCopy);
  };

  return (
    <PureTaskList
      loading={false}
      onArchiveTask={onArchiveTask}
      onPinTask={onPinTask}
      tasks={Object.values(tasks)}
    />
    );
}
