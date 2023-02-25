import { ScrollView } from 'react-native';

import { TaskData, TaskStates } from 'types/task';

import { SortableTask } from './SortableTask';

interface Props {
  tasks: TaskData[];
}

export function SortingTaskListView({ tasks }: Props) {
  const sortableTasks = tasks.filter(t => t.state === TaskStates.TASK_INBOX)

  return (
    <ScrollView>
      {tasks.map((t) => {
        return (
          <SortableTask key={t.id} title={t.title} />
        );
      })}
    </ScrollView>
  );
}
