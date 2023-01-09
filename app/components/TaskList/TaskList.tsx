import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAppData } from 'providers/DataProvider';
import { TaskStates } from 'types/task';
import { createDeleteAlert } from 'utils/deleteListAlert';
import { idGenerator } from 'utils/id';


import { Header } from './components/Header';
import { AddTaskButton } from './components/AddTaskButton';
import { TaskListView } from './components/TaskListView';

export function TaskList({ listId }: { listId: string }) {
  const navigation = useNavigation();

  const { taskLists, deleteList, createTask, updateTask, deleteTask } = useAppData();

  // console.log(`TasksList: ID: ${listId}`);
  // console.log(`TasksList: Data from context:`, taskLists[listId]);

  const thisList = taskLists[listId];
  const tasks = thisList.tasks;

  const onArchiveTask = (taskId: string) => {
    const t = thisList.getTaskById(taskId);
    // console.log('Archiving task id: ', taskId, 'task: ', t);

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
    // console.log('Pinning task. id: ', taskId, 'task: ', t);
    // console.log('All tasks:', JSON.stringify(tasks, null, 2));

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
    // console.log(`Saving task ${taskId}`);

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
  };

  const onPressDeleteList = () => {
    const onConfirmDelete = () => {
      deleteList(thisList.id);
      navigation.navigate('ListsScreen');
    };

    createDeleteAlert(thisList.name, onConfirmDelete);
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
      <StatusBar />

      <Header
        name={thisList.name}
        color={thisList.color}
        onPressBack={() => navigation.goBack()}
        onPressDeleteList={onPressDeleteList}
      />

      <TaskListView
        loading={false}
        onArchiveTask={onArchiveTask}
        onPinTask={onPinTask}
        onSaveTask={onSaveTask}
        onUpdateTaskTitle={onUpdateTaskTitle}
        tasks={Object.values(tasks)}
      />

      <AddTaskButton
        color={thisList.color}
        onPress={onPressAddButton}
      />

    </SafeAreaView>
  );
}
