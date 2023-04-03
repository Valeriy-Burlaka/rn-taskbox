import { useState } from 'react';
import { Keyboard } from 'react-native';

import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { useAppData } from 'providers/DataProvider';
import { TaskStates } from 'types/task';
import { createDeleteAlert } from 'utils/deleteListAlert';

import { palette } from 'theme/Colors';

import { Header } from './components/Header';
import { AddTaskButton } from './components/AddTaskButton';
import { SortingTaskListView } from './components/SortingTaskListView';
import { TaskListView } from './components/TaskListView';

interface HeaderBackgroundProps {
  height: number;
  scrollOffsetY: SharedValue<number>;
};

const HeaderBackground = ({ height, scrollOffsetY }: HeaderBackgroundProps) => {
  if (height <= 0) {
    return null;
  }

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: scrollOffsetY.value > 50 ? palette.AliceBlue : 'transparent',
    height,
  }), [height]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }
      ]}
    />
  );
};

export function TaskList({ listId }: { listId: string }) {
  const navigation = useNavigation();

  const { taskLists, deleteList, createTask, updateTask, deleteTask } = useAppData();

  const [isEditingTasks, setEditingTasks] = useState(false);
  const [isSortingTasks, setSortingTasks] = useState(false);

  const { top: topInsetHeight } = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerBackgroundHeight = headerHeight + topInsetHeight;
  const scrollOffsetY = useSharedValue(0);

  const thisList = taskLists[listId];
  const tasks = thisList.tasks;

  const onPressDeleteList = () => {
    const onConfirmDelete = () => {
      deleteList(thisList.id);
      navigation.navigate('ListsScreen');
    };

    createDeleteAlert(thisList.name, onConfirmDelete);
  };

  const onPressEditList = () => {
    navigation.navigate('UpdateListScreen', { listId: thisList.id });
  };

  const onPressSortTasks = () => {
    setSortingTasks(true);
  }

  const onPressAddButton = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    createNewTaskForEditing();
  };

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
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

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

  // input ended
  const onEndEditingTask = (taskId: string, taskTitle: string, taskState?: TaskStates) => {
    saveTask(taskId, taskTitle, taskState);
  };

  // keyboard's "Submit" button pressed
  const onSubmitEditingTask = (taskId: string, taskTitle: string) => {
    // console.log(`onSubmitEditingTask, task title: "${taskTitle}"`);
    if (taskTitle) {
      // console.log('Can create a new task for editing');
      createNewTaskForEditing();
    } else {
      exitEditTaskMode();
    }
  };

  const createNewTaskForEditing = () => {
    createTask(listId);
  };

  const saveTask = (taskId: string, title: string, state?: TaskStates): boolean => {
    // console.log(`Saving task ${taskId}; title: "${title}"; state: "${state}"`);

    if (!title) {
      // console.log('Task with no title - deleting it');
      deleteTask(listId, taskId);

      return false;
    } else {
      const t = thisList.getTaskById(taskId);
      updateTask(listId, taskId, { title, state: state || t.state });

      return true;
    }
  };

  const enterEditTaskMode = () => {
    setEditingTasks(true);
  };

  const exitEditTaskMode = () => {
    setEditingTasks(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBackground scrollOffsetY={scrollOffsetY} height={headerBackgroundHeight} />

      <Header
        name={thisList.name}
        color={thisList.color}
        isEditingTasks={isEditingTasks || isSortingTasks}
        onHeightDetermined={setHeaderHeight}
        onPressDone={() => {
          if (isEditingTasks) exitEditTaskMode();
          if (isSortingTasks) setSortingTasks(false);
        }}
        onPressBack={() => navigation.goBack()}
        onPressMenuOptionDelete={onPressDeleteList}
        onPressMenuOptionEdit={onPressEditList}
        onPressMenuOptionSort={onPressSortTasks}
      />

      {isSortingTasks ? (
        <SortingTaskListView
          scrollOffsetY={scrollOffsetY}
          tasks={tasks}
        />
      ) : (
        <TaskListView
          color={thisList.color}
          icon={thisList.icon}
          loading={false}
          tasks={tasks}

          onArchiveTask={onArchiveTask}
          onEndEditingTask={onEndEditingTask}
          onFocusTask={enterEditTaskMode}
          onPinTask={onPinTask}
          onSubmitEditingTask={onSubmitEditingTask}
          scrollOffsetY={scrollOffsetY}
        />
      )}

      {!isSortingTasks ? (
        <AddTaskButton
          color={thisList.color}
          onPress={onPressAddButton}
        />
      ) : null}

    </SafeAreaView>
  );
}
