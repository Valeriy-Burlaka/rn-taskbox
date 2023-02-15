import { idGenerator } from 'utils/id';

export enum TaskStates {
  TASK_PINNED = 0,
  TASK_INBOX = 1,
  TASK_NEW = 2,
  TASK_ARCHIVED = 3,
}

export interface TaskData {
  id: string;
  title: string;
  state: TaskStates;
  createdAt: number;
}

export type TaskDataUpdate = Pick<TaskData, 'title'> | Pick<TaskData, 'state'>;
