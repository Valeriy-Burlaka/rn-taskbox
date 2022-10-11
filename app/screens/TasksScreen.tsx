import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from 'components/Themed';
import { TaskList } from 'components/TaskList';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <TaskList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
