import { View } from 'components/Themed';
import { useState } from 'react';
import { ScrollView } from 'react-native';
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

export function SortingTaskListView({ tasks }: Props) {
  const [isReady, setReady] = useState(false);

  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX);

  const positions: TaskPosition[] = sortableTasks.map((task) => {
    return {
      id: task.id,
      order: useSharedValue(0),
      originalX: useSharedValue(0),
      originalY: useSharedValue(0),
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
                position.originalX.value = x;
                position.originalY.value = y;
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
    <ScrollView>
      {sortableTasks.map((task, index) => {
        return (
          <SortableTask
            key={task.id}
            title={task.title}
            positions={positions}
            index={index}
          />
        );
      })}
    </ScrollView>
  );
}
