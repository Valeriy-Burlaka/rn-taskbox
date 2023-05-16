import { useRef } from 'react';
import { ScrollView } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { TaskData, TaskStates } from 'types/task';
import { spacings } from 'theme/Spacings';

import { SortableTask } from './SortableTask';
import { SCREEN_HEIGHT } from 'utils/dimensions';

interface Props {
  tasks: TaskData[];
  scrollOffsetY: SharedValue<number>;
  bottomInsetHeight: number;
  topInsetHeight: number;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// TODO:
// 1. This absolutely does not work on Android. It lags as hell immediately after the pan gesture starts.
// 2. Scroll animation can be done without `requestAnimationFrame`. Use `scrollY.value = withTiming()` instead.
//    When need to stop animation, use `cancelAnimation` from reanimated
export function SortingTaskListView({
  bottomInsetHeight,
  topInsetHeight,
  tasks,
  scrollOffsetY,
}: Props) {
  const sortableItems = tasks.filter(t => t.state === TaskStates.TASK_INBOX);
  const itemHeight = spacings.unitless.space300;
  const totalContentHeight = sortableItems.length * itemHeight;
  const effectiveScreenHeight = SCREEN_HEIGHT - bottomInsetHeight - topInsetHeight;
  const maxScrollOffset = totalContentHeight - effectiveScreenHeight;

  const scrollViewRef = useRef<ScrollView>(null);
  const isScrolling = useSharedValue(false);

  const itemPositions = useSharedValue(
    Object.fromEntries(
      sortableItems.map((item, index) => [item.id, index])
    )
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y }}) => {
      scrollOffsetY.value = y;
    },
  });

  /**
   * When we drag a task and it's near the edge of the task list, we want to start auto-scrolling the list.
   * @param panGestureY A `y` coordinate of the current position of the pointer, relative to the window. Roughly
   * corresponds to the `y` position of the task being dragged on the screen.
   * @returns The direction in which we want to start auto-scrolling the list, or `null`.
   */
  const getAutoScrollDirection = (panGestureY: number): 'down' | 'up' | null => {
    'worklet';

    const autoScrollThreshold = itemHeight;
    const isNearTopEdge = panGestureY - topInsetHeight <= autoScrollThreshold;
    const isNearBottomEdge = SCREEN_HEIGHT - panGestureY - bottomInsetHeight <= autoScrollThreshold;

    if (isNearTopEdge) {
      return 'up' as const;
    } else if (isNearBottomEdge) {
      return 'down' as const;
    }

    return null;
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
    const scrollSpeed = itemHeight * 0.75 * (direction === 'down' ? 1 : -1);

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
        height: totalContentHeight,
      }}
      onScroll={onScroll}
      ref={scrollViewRef}
      scrollEventThrottle={16}
    >
      {sortableItems.map((task, index) => {
        return (
          <SortableTask
            key={task.id}
            height={itemHeight}
            id={task.id}
            positions={itemPositions}
            itemsCount={sortableItems.length}
            scrollOffsetY={scrollOffsetY}
            title={task.title}
            topInsetHeight={topInsetHeight}
            getAutoScrollDirection={getAutoScrollDirection}
            startScrolling={startScrolling}
            stopScrolling={stopScrolling}
          />
        );
      })}
    </AnimatedScrollView>
  );
}
