import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';

import PercolateIcons from 'constants/Percolate';
import { TaskData, TaskStates } from 'types/task';

import { spacings } from 'theme/Spacings';

import { TaskCheckmark } from './components/TaskCheckmark';
import { Props as TaskTitleProps, TaskTitle } from './components/TaskTitle';
import { SORT_TASKS_FEATURE_ENABLED } from 'config/featureFlags';

export type Props = {
  color: string;
  task: TaskData;
  onArchive: (id: string) => void;
  onPin: (id: string) => void;
} & TaskTitleProps;

const Container = styled(View)`
  align-items: center;
  background-color: white;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
  padding-horizontal: ${spacings.space75};
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

  const { id, state } = task;

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

      {(!SORT_TASKS_FEATURE_ENABLED && state !== TaskStates.TASK_NEW) ?
        (
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
          >
            <PercolateIcons
              name="star"
              size={24}
              color={state == TaskStates.TASK_PINNED ? '#26c6da' : '#eee' }
            />
          </TouchableOpacity>
        ) : null
      }

    </Container>
  );
}
