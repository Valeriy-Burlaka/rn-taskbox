import { TouchableOpacity, View } from 'react-native';

import ContextMenu from 'react-native-context-menu-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import styled from '@emotion/native';

import { useAppData } from 'providers/DataProvider';
import { TaskStates } from 'types/task';
import { idGenerator } from 'utils/id';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { TaskListView } from './components/TaskListView';

const HeaderContainer = styled.View<{}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px solid red;
  margin-bottom: ${spacings.space200};
  padding: ${spacings.space100};
`;

const ListName = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

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
    <SafeAreaView style={{ flex: 1}}>
      <StatusBar />

      <HeaderContainer>
        {/* Back button */}
        <TouchableOpacity
          // onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color={thisList.color} />
        </TouchableOpacity>

        {/* List name */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ListName
            color={thisList.color}
          >
            {thisList.name}
          </ListName>
        </View>

        {/* 3-dots menu */}
        <ContextMenu
          actions={[
            {
              title: 'Edit List Info',
              subtitletitle: 'WAT',
              systemIcon: 'pencil',
            },
            {
              title: 'Delete',
              subtitletitle: 'WAT?',
              systemIcon: 'trash',
              destructive: true,
            },
          ]}
          dropdownMenuMode={true}
        >
          <Ionicons name="ios-ellipsis-horizontal-circle" size={26} color={thisList.color} />
        </ContextMenu>
      </HeaderContainer>

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
    </SafeAreaView>
  );
}
