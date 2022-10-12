import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { TextInput, TouchableOpacity, SafeAreaView, View } from 'react-native';
import styled from '@emotion/native';

import PercolateIcons from 'constants/Percolate';

export enum TaskStates {
  TASK_PINNED = 0,
  TASK_INBOX = 1,
  TASK_NEW = 2,
  TASK_ARCHIVED = 3,
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
  onSaveTask: (id: string) => void;
  onUpdateTaskTitle: (id: string, title: string) => void;
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

const TaskTitle = styled(TextInput)`
  background-color: transparent;
  flex: 1;
  font-family: 'NunitoSans';
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
`;

const TaskTitle__Archived = styled(TaskTitle)`
  color: #aaa;
  text-decoration-line: line-through;
  text-decoration-style: solid;
`;

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
  onSaveTask,
  onUpdateTaskTitle,
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

      {state === TaskStates.TASK_NEW && (
        <TaskTitle
          autoFocus={true}
          // onBlur={() => console.log('Input blurred')}
          // onFocus={() => console.log('Input focused')}
          onEndEditing={() => {
            // console.log('Ended editing the task title');
            onSaveTask(id);
          }}
          onChange={(e) => onUpdateTaskTitle(id, e.nativeEvent.text)}
        />
      )}

      {state === TaskStates.TASK_ARCHIVED && (
        <TaskTitle__Archived
          value={title}
          editable={false}
        />
      )}

      {(state === TaskStates.TASK_PINNED || state === TaskStates.TASK_INBOX) && (
        <TaskTitle
          value={title}
          editable={false}
        />
      )}

      {state !== TaskStates.TASK_NEW && (
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
      )}

    </Container>
  );
}
