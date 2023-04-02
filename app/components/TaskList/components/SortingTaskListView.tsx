import { useCallback, useEffect, useRef, useState, } from 'react';
import { FlatList, ScrollView, View, Dimensions } from 'react-native';
import {
  useSharedValue,
  runOnUI,
  runOnJS,
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_HEIGHT } from 'constants/Layout';

import { TaskData, TaskStates } from 'types/task';

import { SortableTask, TASK_HEIGHT, type TaskPosition } from './SortableTask';
import { AnimatedFlatList } from './utils/AnimatedFlatList';

interface Props {
  scrollOffsetY: SharedValue<number>;
  tasks: TaskData[];
}

export function SortingTaskListView({ scrollOffsetY, tasks }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  // Doesn't take into account height taken by screen header, which means that we will instruct
  // our <FlatList> to render 1 or 2 more `initialNumToRender` items than we actually need to.
  // This is totally fine though, as we don't have to complicate the screen by waiting for
  // `onLayoutEffect` in <Header> component, passing around its height, etc.
  const practicalScreenHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
  const numInitialItemsToRender = Math.ceil(practicalScreenHeight / TASK_HEIGHT);

  // useEffect(() => {
  //   console.log('FlatList ref methods:', flatListRef?.current?.getNativeScrollRef)
  //   console.log('FlatList ref methods, scrollToOffset:', flatListRef?.current?.scrollToOffset)
  //   // const scrollRef = flatListRef?.current?.getNativeScrollRef();
  //   // console.log(scrollRef)
  //   // console.log('FlatList scrollRef:', scrollRef)
  //   // console.log('FlatList scrollRef methods:', scrollRef.scrollToOffset)
  //   if (flatListRef?.current?.scrollToOffset) {
  //     flatListRef?.current?.scrollToOffset({ offset: 100, animated: true });
  //   }
  // },[flatListRef.current])

  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX);

  const renderItem = useCallback(({ index, item }: { index: number, item: TaskData}) => {
    return (
      <SortableTask
        key={item.id}
        title={item.title}
        index={index}
      />
    )
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y }}) => {
      scrollOffsetY.value = y;
    },
  });

  return (
    <AnimatedFlatList
      data={sortableTasks}
      renderItem={null}  // TODO: document the issue with zIndex ( https://github.com/facebook/react-native/issues/28751 )
      CellRendererComponent={renderItem}  // This is how I made `zIndex` work for me

      ref={flatListRef}
      initialNumToRender={numInitialItemsToRender}
      onLayout={({
        nativeEvent: {
          layout: { x, y, height, width, },
        },
      }) => {
        console.log('Screen height:', SCREEN_HEIGHT)
        console.log('SortableTasksList AnimatedFlatList onLayout:', x, y, height, width);
        // console.log('Can fit on screen: ', (SCREEN_HEIGHT - insets.top - insets.bottom) / TASK_HEIGHT, 'tasks')
      }}
      onScroll={onScroll}
    />
  );
}
