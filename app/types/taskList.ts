import { TaskData } from './task';

export interface TaskList {
  id: string;
  name: string;
  color: string; // Hex | theme/palette member
  icon: string;  // iconSet member
  tasks: TaskData[];
}

// omg.. do something with this
export type NewTaskList =
  Pick<TaskList, 'name' | 'color' | 'icon'> &
  Partial<Pick<TaskList, 'id' | 'tasks'>>;
