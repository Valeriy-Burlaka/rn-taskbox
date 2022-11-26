import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from 'components/Themed';
import { TaskList } from 'components/TaskList';

export default function TasksScreen() {
  const listId = "list-initial";
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
