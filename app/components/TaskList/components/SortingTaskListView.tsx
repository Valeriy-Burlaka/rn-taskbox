import { useRef } from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { TaskData, TaskStates } from 'types/task';
import { spacings } from 'theme/Spacings';

import { SortableTask, type TaskPosition } from './SortableTask';
import { SCREEN_HEIGHT } from 'utils/dimensions';

interface Props {
  tasks: TaskData[];
  scrollOffsetY: SharedValue<number>;
  bottomInsetHeight: number;
  topInsetHeight: number;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function SortingTaskListView({
  bottomInsetHeight,
  topInsetHeight,
  tasks,
  scrollOffsetY,
}: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrolling = useSharedValue(false);

  const itemHeight = spacings.unitless.space300;
  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX);
  const positions: TaskPosition[] = sortableTasks.map((task, index) => {
    return {
      id: task.id,
      title: task.title,
      order: useSharedValue(index),
      y: useSharedValue(itemHeight * index),
      height: useSharedValue(itemHeight),
    };
  });
  const contentHeight = positions.length * itemHeight;
  const effectiveScreenHeight = SCREEN_HEIGHT - (bottomInsetHeight + topInsetHeight);
  const maxScrollOffset = contentHeight - effectiveScreenHeight;
  // console.log('Max scroll offset:', maxScrollOffset);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y }}) => {
      scrollOffsetY.value = y;
    },
  });

  const getScrollDirection = (panY: number): 'down' | 'up' | null => {
    "worklet";

    const nearEdgeThreshold = 30;
    let result = null;

    if (panY - topInsetHeight <= nearEdgeThreshold) {
      result = 'up' as const;
    } else if (SCREEN_HEIGHT - panY - bottomInsetHeight <= nearEdgeThreshold) {
      result = 'down' as const;
    }

    return result;
  };

  const startScrolling = (direction: 'down' | 'up') => {
    // console.log('Start scrolling...');

    const alreadyScrolling = isScrolling.value;
    const canScrollFurther = direction === 'down' ?
      scrollOffsetY.value <= maxScrollOffset :
      scrollOffsetY.value > 0;
    if (alreadyScrolling || !canScrollFurther) {
      return;
    }

    isScrolling.value = true;

    let start = 0;
    const scrollSpeed = direction === 'down' ? 15 : -15;

    function scroll(timestamp: number) {
      // console.log('In scroll worker:', start, timestamp, timestamp - start, isScrolling.value);
      if (!isScrolling.value) {
        // console.log('In scroll worker: No longer scrolling...');
        return;
      }

      const elapsed = timestamp - start;
      if (elapsed > 250) {
        // console.log('Scroll worker, enough time elapsed, now DO scrolling: ', scrollOffsetY.value, scrollSpeed);

        scrollViewRef?.current?.scrollTo({ y: scrollOffsetY.value + scrollSpeed, animated: true });
        start = timestamp;
      }

      // console.log('Scroll worker, requesting NEXT animation frame...');
      window.requestAnimationFrame(scroll);
    }

    // console.log('Requesting FIRST animation frame...');
    window.requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    // console.log('STOP scrolling...');
    isScrolling.value = false;
  };

  return (
    <AnimatedScrollView
      contentContainerStyle={{
        height: contentHeight,
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
            getScrollDirection={getScrollDirection}
            startScrolling={startScrolling}
            stopScrolling={stopScrolling}
          />
        );
      })}
    </AnimatedScrollView>
  );
}
