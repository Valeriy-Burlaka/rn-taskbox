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
  order?: number;
}

export type TaskDataUpdate = Partial<Pick<TaskData, 'title' | 'state' | 'order'>>;
