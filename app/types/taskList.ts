import { TaskData } from './task';

export interface TaskList {
  id: string;
  name: string;
  color: string; // Hex | theme/palette member
  icon: string;  // iconSet member
  tasks: TaskData[];
}
