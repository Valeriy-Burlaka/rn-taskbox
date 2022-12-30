import { Entypo } from '@expo/vector-icons';
import styled from '@emotion/native';

import { useAppData } from 'providers/DataProvider';
import { TaskStates } from 'types/task';
import { idGenerator } from 'utils/id';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { TaskListView } from './components/TaskListView';

const AddTaskButtonContainer = styled.View`
  position: absolute;
  bottom: 40px;
  right: 30px;

  flex-direction: row;
  align-items: center;
`;

const AddTaskButton = styled.TouchableOpacity<{ backgroundColor: string; size: number }>
`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ size }) => `${size / 2}px`};
  align-items: center;
  justify-content: center;
  margin-right: ${spacings.space50};
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

const AddTaskText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

export function TaskList({ listId }: { listId: string }) {
  const { taskLists, createTask, updateTask, deleteTask } = useAppData();

  // console.log(`TasksList: ID: ${listId}`);
  // console.log(`TasksList: Data from context:`, taskLists[listId]);

  const thisList = taskLists[listId];
  const tasks = thisList.tasks;

  const onArchiveTask = (taskId: string) => {
    const t = thisList.getTaskById(taskId);
    // console.log('Archiving task id: ', taskId, 'task: ', t);

    if (!t.title) {
      deleteTask(listId, t.id);
    } else {
      updateTask(listId, t.id, {
        state: t.state !== TaskStates.TASK_ARCHIVED ? TaskStates.TASK_ARCHIVED : TaskStates.TASK_INBOX,
      });
    }
  };

  const onPinTask = (taskId: string) => {
    const t = thisList.getTaskById(taskId);
    // console.log('Pinning task. id: ', taskId, 'task: ', t);
    // console.log('All tasks:', JSON.stringify(tasks, null, 2));

    if (t.state === TaskStates.TASK_ARCHIVED) {
      return;
    }

    updateTask(listId, t.id, {
      state: t.state === TaskStates.TASK_INBOX ? TaskStates.TASK_PINNED : TaskStates.TASK_INBOX,
    });
  };

  const onUpdateTaskTitle = (taskId: string, title: string) => {
    updateTask(listId, taskId, { title });
  };

  const onSaveTask = (taskId: string) => {
    // console.log(`Saving task ${taskId}`);

    const t = thisList.getTaskById(taskId);
    if (!t.title) {
      deleteTask(listId, taskId);
    } else {
      updateTask(listId, taskId, { state: TaskStates.TASK_INBOX });
    }
  };

  const onPressAddButton = () => {
    createTask(listId, {
      id: `task-${idGenerator()}`,
      title: '',
      state: TaskStates.TASK_NEW,
    });
  }

  return (
    <>
      <TaskListView
        loading={false}
        onArchiveTask={onArchiveTask}
        onPinTask={onPinTask}
        onSaveTask={onSaveTask}
        onUpdateTaskTitle={onUpdateTaskTitle}
        tasks={Object.values(tasks)}
      />
      <AddTaskButtonContainer>
        <AddTaskButton
          backgroundColor={thisList.color}
          onPress={onPressAddButton}
          size={32}
        >
          <Entypo name="plus" size={24} color="white" />
        </AddTaskButton>
        <AddTaskText color={thisList.color}>
          New Reminder
        </AddTaskText>
      </AddTaskButtonContainer>
    </>
  );
}
