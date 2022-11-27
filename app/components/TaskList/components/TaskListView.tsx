import * as React from 'react';
import { FlatList, View, Text, SafeAreaView } from 'react-native';
import styled from '@emotion/native';

import { TaskData } from 'types/task';

import PercolateIcons from 'constants/Percolate';
import { styles } from 'constants/globalStyles';
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

const ListItemsEmpty = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const ListItems = styled(SafeAreaView)`
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
      <ListItems>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </ListItems>
    );
  }

  if (tasks.length === 0) {
    return (
      <ListItemsEmpty>
        <View>
          <PercolateIcons name="check" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>You have no tasks</Text>
          <Text style={styles.SubtitleMessage}>Sit back and relax</Text>
        </View>
      </ListItemsEmpty>
    );
  }

  const tasksInOrder = [ ...tasks ].sort((t1: TaskData, t2: TaskData) => {
    if (t1.state === t2.state) {
      return t1.title.toLowerCase().charCodeAt(0) - t2.title.toLowerCase().charCodeAt(0);
    } else {
      return t1.state - t2.state;
    }
  });

  return (
    <ListItems>
      <FlatList
        data={tasksInOrder}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </ListItems>
  );
}
