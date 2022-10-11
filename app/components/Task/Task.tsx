import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { TextInput, TouchableOpacity, SafeAreaView, View } from 'react-native';
import styled from '@emotion/native';

import PercolateIcons from 'constants/Percolate';
import { styles } from 'constants/globalStyles';

// import TaskTitle from './components/TaskTitle';

export enum TaskStates {
  TASK_PINNED = 0,
  TASK_INBOX = 1,
  TASK_ARCHIVED = 2,
}

export interface TaskData {
  id: string;
  title: string;
  state: TaskStates;
}

export interface Props {
  task: TaskData;
  onArchiveTask: (id: string) => void;
  onPinTask: (id: string) => void;
}

const Container = styled(SafeAreaView)`
  background-color: white;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
`;

const Checkbox = styled(View)`
  border-color: #26c6da;
  border-style: solid;
  border-width: 2px;
  border-radius: 100px;
  background-color: transparent;
  height: 24px;
  width: 24px;
`;

// const TaskTitle__Archived = styled(TaskTitle)`
//   color: #aaa;
//   text-decoration-line: line-through;
//   text-decoration-style: solid;
// `;

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}: Props) {
  return (
    <Container>

      <TouchableOpacity
        hitSlop={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        }}
        style={{
          paddingHorizontal: 12,
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onArchiveTask(id);
        }}
      >
        {state !== TaskStates.TASK_ARCHIVED ? (
          <Checkbox />
        ) : (
          <PercolateIcons name="check" size={26} color={'#2cc5d2'} />
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Input Title"
        style={
          state === TaskStates.TASK_ARCHIVED ? styles.ListItemInputTaskArchived : styles.ListItemInputTask
        }
        value={title}
        editable={false}
      />

      <TouchableOpacity
        hitSlop={{
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPinTask(id);
        }}
        style={{
          paddingHorizontal: 12,
        }}
      >
        <PercolateIcons
          name="star"
          size={24}
          color={state == TaskStates.TASK_PINNED ? '#26c6da' : '#eee' }
        />
      </TouchableOpacity>

    </Container>
  );
}
