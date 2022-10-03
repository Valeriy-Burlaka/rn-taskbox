import * as React from 'react';
import { TextInput, TouchableOpacity, SafeAreaView,View } from 'react-native';

import { styles } from 'constants/globalStyles';
import PercolateIcons from 'constants/Percolate';

export interface TaskData {
  id: string;
  title: string;
  state: string;
}

export interface Props {
  task: TaskData;
  onArchiveTask: (id: string) => void;
  onPinTask: (id: string) => void;
}

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}: Props) {
  return (
    <SafeAreaView style={styles.ListItem}>
    <TouchableOpacity onPress={() => onArchiveTask(id)}>
      {state !== 'TASK_ARCHIVED' ? (
        <View style={styles.CheckBox} />
      ) : (
        <PercolateIcons name="check" size={20} color={'#2cc5d2'} />
      )}
    </TouchableOpacity>
    <TextInput
      placeholder="Input Title"
      style={
        state === 'TASK_ARCHIVED' ? styles.ListItemInputTaskArchived : styles.ListItemInputTask
      }
      value={title}
      editable={false}
    />
    <TouchableOpacity onPress={() => onPinTask(id)}>
      <PercolateIcons
        name="star"
        size={20}
        color={state == 'TASK_PINNED' ? '#26c6da' : '#eee' }
      />
    </TouchableOpacity>
  </SafeAreaView>
  );
}
