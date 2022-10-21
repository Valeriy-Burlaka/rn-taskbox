import React, { useEffect, useState } from 'react';

import { AddTaskButton } from 'components/AddTaskButton';
import { TaskData, TaskStates } from 'components/Task';

import PureTaskList from './components/PureTaskList';

function getTasks():{[key: string]: TaskData} {
  const result = {
    '1': {
      id: '1',
      title: 'Add real handlers',
      state: TaskStates.TASK_ARCHIVED,
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
    '9': {
      id: '9',
      title: 'Test Placeholder',
      state: TaskStates.TASK_ARCHIVED,
    },
    '10': {
      id: '10',
      title: 'Test Placeholder',
      state: TaskStates.TASK_ARCHIVED,
    },
    '11': {
      id: '11',
      title: 'Test Placeholder',
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

  const onArchiveTask = (id: string) => {
    const t = tasks[id];
    const tasksCopy = { ...tasks };

    // console.log('Archiving task id: ', id, 'task: ', t);
    // console.log('Current tasks:', JSON.stringify(tasksCopy, null, 2));

    if (!t.title) {
      // console.log("Can't archive a task with an empty title, deleting permanently instead");
      delete tasksCopy[id];
      // console.log('Tasks after:', JSON.stringify(tasksCopy, null, 2));
    } else {
      tasksCopy[t.id] = {
        ...t,
        state: t.state !== TaskStates.TASK_ARCHIVED ? TaskStates.TASK_ARCHIVED : TaskStates.TASK_INBOX,
      };
    }
    // console.log('Setting tasks to:', JSON.stringify(tasksCopy, null, 2));

    setTasks(tasksCopy);
  };
  
  const onPinTask = (id: string) => {
    const t = tasks[id];
    // console.log('Pinning task. id: ', id, 'task: ', t);
    // console.log('All tasks:', JSON.stringify(tasks, null, 2));
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

  const onUpdateTaskTitle = (id: string, title: string) => {
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        title,
      },
    });
  };

  const onSaveTask = (id: string) => {
    // console.log('Saving task:', tasks[id]);

    if (!tasks[id].title) {
      delete tasks[id];
      setTasks({...tasks});
    } else {
      setTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          state: TaskStates.TASK_INBOX,
        },
      });
    }

  };

  const onPressAddButton = () => {
    const currentMaxId = Math.max(...Object.keys(tasks).map(Number));
    const newId = (currentMaxId + 1).toString();
    // console.log('Pressed Add Button. New ID:', newId);
    setTasks({
      ...tasks,
      [newId]: {
        id: newId,
        title: '',
        state: TaskStates.TASK_NEW,
      }
    })
  };

  return (
    <>
      <PureTaskList
        loading={false}
        onArchiveTask={onArchiveTask}
        onPinTask={onPinTask}
        onSaveTask={onSaveTask}
        onUpdateTaskTitle={onUpdateTaskTitle}
        tasks={Object.values(tasks)}
      />
      <AddTaskButton
        onPress={onPressAddButton}
        styles={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
}
