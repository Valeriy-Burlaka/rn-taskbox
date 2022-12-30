import * as React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import styled from '@emotion/native';

import { TaskData } from 'types/task';

import { Task, Props as TaskProps } from 'components/Task';

import LoadingRow from './LoadingRow';

type Props = {
  loading: boolean;
  tasks: TaskData[];
} &
  Pick<TaskProps, 'onArchiveTask'>
  &
  Pick<TaskProps, 'onPinTask'>
  &
  Pick<TaskProps, 'onUpdateTaskTitle'>
  &
  Pick<TaskProps, 'onSaveTask'>
;

const ListItemsContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: 'white';
`;

export function TaskListView({
  loading,
  tasks,
  onArchiveTask,
  onPinTask,
  onSaveTask,
  onUpdateTaskTitle,
}: Props) {
  const events = {
    onPinTask,
    onArchiveTask,
    onSaveTask,
    onUpdateTaskTitle,
  };

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
      <FlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </ListItemsContainer>
  );
}
