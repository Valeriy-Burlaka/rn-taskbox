import React, { useEffect, useState } from 'react';

import { useAppData } from 'providers/DataProvider';
import { TaskData, TaskStates } from 'types/task';
import { idGenerator } from 'utils/id';

import { AddTaskButton } from 'components/AddTaskButton';

import PureTaskList from './components/PureTaskList';

// async function setTasks(listId: string, tasks: {[key: string]: TaskData}): Promise<void> {
//   const initialTasks = {
//     '1': {
//       id: '1',
//       title: 'Add real handlers',
//       state: TaskStates.TASK_ARCHIVED,
//     },
//     '2': {
//       id: '2',
//       title: '"Create task" button & handler',
//       state: TaskStates.TASK_PINNED,
//     },
//     '3': {
//       id: '3',
//       title: 'Use local storage to store tasks',
//       state: TaskStates.TASK_INBOX,
//     },
//     '4': {
//       id: '4',
//       title: 'Error screen',
//       state: TaskStates.TASK_INBOX,
//     },
//     '5': {
//       id: '5',
//       title: 'Marry styled-components & storybook',
//       state: TaskStates.TASK_INBOX,
//     },
//     '6': {
//       id: '6',
//       title: 'deploy web?',
//       state: TaskStates.TASK_INBOX,
//     },
//     '7': {
//       id: '7',
//       title: 'deploy app-dev?',
//       state: TaskStates.TASK_INBOX,
//     },
//     '8': {
//       id: '8',
//       title: 'Setup storybook on-device',
//       state: TaskStates.TASK_ARCHIVED,
//     },
//     '9': {
//       id: '9',
//       title: 'Test Placeholder',
//       state: TaskStates.TASK_ARCHIVED,
//     },
//     '10': {
//       id: '10',
//       title: 'Test Placeholder',
//       state: TaskStates.TASK_ARCHIVED,
//     },
//     '11': {
//       id: '11',
//       title: 'Test Placeholder',
//       state: TaskStates.TASK_ARCHIVED,
//     },
//   };
// }

export function TaskList({ listId }: { listId: string }) {
  const { taskLists, createTask, updateTask, deleteTask } = useAppData();

  console.log(`TasksList: ID: ${listId}`);
  console.log(`TasksList: Data from context:`, taskLists[listId]);

  const thisList = taskLists[listId];
  const tasks = thisList.tasks;

  useEffect(() => {
    return () => {
      console.log('Unmounting TaskList:', listId);
    };
  }, []);

  const onArchiveTask = (taskId: string) => {
    const t = thisList.getTaskById(taskId);
    console.log('Archiving task id: ', taskId, 'task: ', t);

    if (!t.title) {
      deleteTask(listId, t.id);
    } else {
      updateTask(listId, t.id, {
        state: t.state !== TaskStates.TASK_ARCHIVED ? TaskStates.TASK_ARCHIVED : TaskStates.TASK_INBOX,
      });
    }
  };
  
  const onPinTask = (taskId: string) => {
    const t = thisList.getTaskById(taskId);
    console.log('Pinning task. id: ', taskId, 'task: ', t);
    console.log('All tasks:', JSON.stringify(tasks, null, 2));
    if (t.state === TaskStates.TASK_ARCHIVED) {
      return;
    }

    updateTask(listId, t.id, {
      state: t.state === TaskStates.TASK_INBOX ? TaskStates.TASK_PINNED : TaskStates.TASK_INBOX,
    });
  };

  const onUpdateTaskTitle = (taskId: string, title: string) => {
    updateTask(listId, taskId, { title });
  };

  const onSaveTask = (taskId: string) => {
    console.log(`Saving task ${taskId}`);
    const t = thisList.getTaskById(taskId);
    if (!t.title) {
      deleteTask(listId, taskId);
    } else {
      updateTask(listId, taskId, { state: TaskStates.TASK_INBOX });
    }
  };

  const onPressAddButton = () => {
    createTask(listId, {
      id: `task-${idGenerator()}`,
      title: '',
      state: TaskStates.TASK_NEW,
    });
  }

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
