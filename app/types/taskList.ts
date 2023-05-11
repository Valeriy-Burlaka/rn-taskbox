import type { GlyphIcon } from 'constants/Fontello';

import type { PaletteColor } from 'theme/Colors';

import { TaskData } from './task';

export interface TaskList {
  id: string;
  name: string;
  color: PaletteColor;
  icon: GlyphIcon;
  tasks: TaskData[];
  tasksOrder: 'legacy' | 'by-date-created' | 'manual';
}

export type NewTaskList = Omit<TaskList, 'id' | 'tasksOrder' | 'tasks'>;
// TODO: Either<> type, not Partial<>
export type TaskListUpdate = Partial<Pick<TaskList, 'name' | 'color' | 'icon' | 'tasksOrder'>>;
