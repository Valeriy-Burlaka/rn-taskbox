import { useRef } from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, type SharedValue } from 'react-native-reanimated';

import { TaskData, TaskStates } from 'types/task';
import { spacings } from 'theme/Spacings';

import { SortableTask, type TaskPosition } from './SortableTask';

interface Props {
  tasks: TaskData[];
  scrollOffsetY: SharedValue<number>;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function SortingTaskListView({ tasks, scrollOffsetY }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX);

  const itemHeight = spacings.unitless.space300;

  const positions: TaskPosition[] = sortableTasks.map((task, index) => {
    return {
      id: task.id,
      title: task.title,
      order: useSharedValue(index),
      y: useSharedValue(itemHeight * index),
      height: useSharedValue(itemHeight),
    };
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y }}) => {
      scrollOffsetY.value = y;
    },
  });

  return (
    <AnimatedScrollView
      contentContainerStyle={{
        height: positions.length * itemHeight,
      }}
      onScroll={onScroll}
      ref={scrollViewRef}
      scrollEventThrottle={16}
    >
      {sortableTasks.map((task, index) => {
        return (
          <SortableTask
            key={task.id}
            height={itemHeight}
            index={index}
            positions={positions}
            title={task.title}
          />
        );
      })}
    </AnimatedScrollView>
  );
}
