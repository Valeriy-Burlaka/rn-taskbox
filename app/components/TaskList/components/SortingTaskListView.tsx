import { useEffect, useRef, useState, } from 'react';
import { FlatList, ScrollView, View, Dimensions } from 'react-native';
import {
  useSharedValue,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';

import { TaskData, TaskStates } from 'types/task';

import { SortableTask, type TaskPosition } from './SortableTask';

interface Props {
  tasks: TaskData[];
}

const { width, height } = Dimensions.get('window');
console.log('Screen width:', width, 'height:', height)

export function SortingTaskListView({ tasks }: Props) {
  const [isReady, setReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log('FlatList ref methods:', flatListRef?.current?.getNativeScrollRef)
    console.log('FlatList ref methods, scrollToOffset:', flatListRef?.current?.scrollToOffset)
    // const scrollRef = flatListRef?.current?.getNativeScrollRef();
    // console.log(scrollRef)
    // console.log('FlatList scrollRef:', scrollRef)
    // console.log('FlatList scrollRef methods:', scrollRef.scrollToOffset)
    if (flatListRef?.current?.scrollToOffset) {
      flatListRef?.current?.scrollToOffset({ offset: 960, animated: true });
    }
  },[flatListRef.current])

  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX);

  const positions: TaskPosition[] = sortableTasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
      order: useSharedValue(0),
      x: useSharedValue(0),
      y: useSharedValue(0),
      height: useSharedValue(0),
      width: useSharedValue(0),
      isReady: useSharedValue(false),
    };
  });

  if (!isReady) {
    return (
      <ScrollView>
        {sortableTasks.map((task, index) => {
          return (
            <View
              key={task.id}
              onLayout={({
                nativeEvent: {
                  layout: { x, y, height, width, },
                },
              }) => {
                const position = positions[index];
                position.order.value = index;
                position.x.value = x;
                position.y.value = y;
                position.height.value = height;
                position.width.value = width;
                position.isReady.value = true;

                runOnUI(() => {
                  "worklet";
                  if (positions.every((pos) => pos.isReady.value === true)) {
                    runOnJS(setReady)(true);
                  }
                })();
              }}
            >
              <SortableTask
                title={task.title}
              />
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      onLayout={({
        nativeEvent: {
          layout: { x, y, height, width, },
        },
      }) => {
        console.log('SortableTasksList FlatList onLayout:', x, y, height, width)
      }}
      data={sortableTasks}
      renderItem={({ item, index }) => {
        return (
          <SortableTask
            key={item.id}
            title={item.title}
            index={index}
          />
        )
      }}
    />

    // <ScrollView>
    //   {sortableTasks.map((task, index) => {
    //     return (
    //       <SortableTask
    //         key={task.id}
    //         title={task.title}
    //         positions={positions}
    //         index={index}
    //       />
    //     );
    //   })}
    // </ScrollView>
  );
}
