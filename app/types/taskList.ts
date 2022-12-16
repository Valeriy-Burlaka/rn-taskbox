import { TaskData } from './task';

export interface TaskList {
  id: string;
  name: string;
  color: string; // Hex | theme/palette member
  icon: string;  // iconSet member
  tasks: TaskData[];
}

// omg.. do something with this
// FIXME: I don't remember what's going on here just after 3 or 4 weeks. A new list doesn't have tasks, that's clear. But this type seems to allow a list with tasks but w/o an "id", which is plain wrong!
export type NewTaskList =
  Pick<TaskList, 'name' | 'color' | 'icon'> &
  Partial<Pick<TaskList, 'id' | 'tasks'>>;
