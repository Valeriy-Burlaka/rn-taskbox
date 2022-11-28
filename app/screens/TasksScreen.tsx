import * as React from 'react';
import { StyleSheet } from 'react-native';

import { type RootStackScreenProps} from 'types/navigation';

import { View } from 'components/Themed';
import { TaskList } from 'components/TaskList';

export default function TasksScreen({ route }: RootStackScreenProps<'TasksScreen'>) {
  const { listId } = route.params;
  console.log('TasksScreen: listId: ', listId);

  return (
    <View style={styles.container}>
      <TaskList listId={listId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
