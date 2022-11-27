import * as React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { styles } from 'constants/globalStyles';
import { task, actions } from 'components/Task';
import { TaskStates } from 'types/task';

import { TaskListView } from './TaskListView';

const taskList = {
  loading: false,
}

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withArchivedTasks = [
  { id: '1', title: 'Task 1 (archived)', state: TaskStates.TASK_ARCHIVED },
  ...defaultTasks.slice(1, 6),
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: TaskStates.TASK_PINNED },
];

export const withArchivedAndPinnedTasks = [
  { id: '1', title: 'Task 1 (archived)', state: TaskStates.TASK_ARCHIVED },
  ...defaultTasks.slice(1, 5),
  { id: '6', title: 'Task 6 (pinned)', state: TaskStates.TASK_PINNED },
];

storiesOf('TaskListView', module)
  .addDecorator(story => <View style={[styles.TaskBox, { padding: 10 }]}>{story()}</View>)
  .add('default', () => <TaskListView {...taskList} tasks={defaultTasks} {...actions} />)
  .add('withArchivedTasks', () => <TaskListView {...taskList} tasks={withArchivedTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskListView {...taskList} tasks={withPinnedTasks} {...actions} />)
  .add('withArchivedAndPinnedTasks', () => <TaskListView {...taskList} tasks={withArchivedAndPinnedTasks} {...actions} />)
  .add('loading', () => <TaskListView loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskListView {...taskList} tasks={[]} {...actions} />);
