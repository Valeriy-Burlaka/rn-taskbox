import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import styled from '@emotion/native';

import { TaskData } from 'types/task';

import { Task, Props as TaskProps } from 'components/Task';

import LoadingRow from './LoadingRow';

export type Props = {
  color: string;
  loading: boolean;
  tasks: TaskData[];
  onArchiveTask: TaskProps['onArchive'];
  onPinTask: TaskProps['onPin'];
  onEndEditingTask: TaskProps['onEndEditing'];
  onFocusTask: TaskProps['onFocus'];
  onSubmitEditingTask: TaskProps['onSubmitEditing'];
};

const ListItemsContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: 'white';
`;

export function TaskListView({
  color,
  loading,
  tasks,
  onArchiveTask,
  onEndEditingTask,
  onFocusTask,
  onPinTask,
  onSubmitEditingTask,
}: Props) {

  if (loading) {
    return (
      <ListItemsContainer>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </ListItemsContainer>
    );
  }

  return (
    <ListItemsContainer>
      <KeyboardAwareFlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => {
          return (
            <Task
              key={item.id}
              color={color}
              task={item}
              onArchive={onArchiveTask}
              onEndEditing={onEndEditingTask}
              onFocus={onFocusTask}
              onPin={onPinTask}
              onSubmitEditing={onSubmitEditingTask}
            />
          );
        }}
      />
    </ListItemsContainer>
  );
}
