import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import styled from '@emotion/native';

import { TaskData } from 'types/task';

import { FontelloIcon, type GlyphIcon } from 'constants/Fontello';
import { spacings } from 'theme/Spacings';

import { Task, Props as TaskProps } from 'components/Task';

import LoadingRow from './LoadingRow';

export type Props = {
  color: string;
  icon: GlyphIcon;
  loading: boolean;
  tasks: TaskData[];
  onArchiveTask: TaskProps['onArchive'];
  onPinTask: TaskProps['onPin'];
  onEndEditingTask: TaskProps['onEndEditing'];
  onFocusTask: TaskProps['onFocus'];
  onSubmitEditingTask: TaskProps['onSubmitEditing'];
};

const ListItemsContainer = styled(SafeAreaView)`
  flex: 1;
`;

export function TaskListView({
  color,
  icon,
  loading,
  tasks,
  onArchiveTask,
  onEndEditingTask,
  onFocusTask,
  onPinTask,
  onSubmitEditingTask,
}: Props) {

  if (loading) {
    return (
      <ListItemsContainer>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </ListItemsContainer>
    );
  }

  return (
    <ListItemsContainer>

      <View style={[
        {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.4,
        },
        StyleSheet.absoluteFillObject,
      ]}>
        <FontelloIcon
          name={icon}
          color={color}
          size={spacings.unitless.space400}
        />
      </View>

      <KeyboardAwareFlatList
        data={tasks}
        initialNumToRender={15} // FIXME: make this dynamic
        keyExtractor={task => task.id}
        renderItem={({ item }) => {
          return (
            <Task
              key={item.id}
              color={color}
              task={item}
              onArchive={onArchiveTask}
              onEndEditing={onEndEditingTask}
              onFocus={onFocusTask}
              onPin={onPinTask}
              onSubmitEditing={onSubmitEditingTask}
            />
          );
        }}
      />

    </ListItemsContainer>
  );
}
