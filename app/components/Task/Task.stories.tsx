import * as React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { styles } from 'constants/globalStyles';
import Task, { TaskStates } from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: TaskStates.TASK_INBOX,
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
  onSaveTask: action('onSaveTask'),
  onUpdateTaskTitle: action('onUpdateTaskTitle'),
};

storiesOf('Task', module)
  .addDecorator((story) => <View style={styles.TaskBox}>{story()}</View>)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: TaskStates.TASK_PINNED }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: TaskStates.TASK_ARCHIVED }} {...actions} />);
