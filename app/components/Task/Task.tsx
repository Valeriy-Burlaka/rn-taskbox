import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import styled from '@emotion/native';

import PercolateIcons from 'constants/Percolate';
import { TaskData, TaskStates } from 'types/task';

import { TaskCheckmark } from './components/TaskCheckmark';
import { Props as TaskTitleProps, TaskTitle } from './components/TaskTitle';

export type Props = {
  color: string;
  task: TaskData;
  onArchive: (id: string) => void;
  onPin: (id: string) => void;
} & TaskTitleProps;

const Container = styled(SafeAreaView)`
  background-color: white;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
`;

export default function Task({
  color,
  task,
  onArchive,
  onPin,
  onEndEditing,
  onSubmitEditing,
  onFocus,
}: Props) {

  const { id, title, state } = task;

  return (
    <Container>

      <TaskCheckmark
        checked={state === TaskStates.TASK_ARCHIVED}
        color={color}
        onPress={() => onArchive(id)}
      />

      <TaskTitle
        task={task}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmitEditing}
      />

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
            onPin(id);
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
