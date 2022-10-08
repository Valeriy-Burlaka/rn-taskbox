import * as React from 'react';
import { FlatList, View, Text, SafeAreaView } from 'react-native';

import PercolateIcons from 'constants/Percolate';
import { styles } from 'constants/globalStyles';
import { Task, TaskData, Props as TaskProps } from 'components/Task';

import LoadingRow from './LoadingRow';

type Props = {
  loading: boolean;
  tasks: TaskData[];
} &
  Pick<TaskProps, 'onArchiveTask'>
  &
  Pick<TaskProps, 'onPinTask'>;

export default function PureTaskList({ loading, tasks, onArchiveTask, onPinTask }: Props) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </SafeAreaView>
    );
  }

  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItemsEmpty}>
        <View>
          <PercolateIcons name="check" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>You have no tasks</Text>
          <Text style={styles.SubtitleMessage}>Sit back and relax</Text>
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasksInOrder}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}
