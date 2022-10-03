import * as React from 'react';
import { FlatList, Text, SafeAreaView } from 'react-native';
import { Task, Props as TaskProps, TaskData } from 'components/Task';
import { styles } from 'constants/globalStyles';

type Props = {
  loading: boolean;
  tasks: TaskData[];
} &
  Pick<TaskProps, 'onArchiveTask'>
  &
  Pick<TaskProps, 'onPinTask'>;

export default function TaskList({ loading, tasks, onArchiveTask, onPinTask }: Props) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>loading</Text>
      </SafeAreaView>
    );
  }
  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>empty</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}
