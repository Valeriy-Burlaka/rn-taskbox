import { type GlyphIcon } from 'constants/Fontello';
import { palette, type PaletteColor } from 'theme/Colors';
import { NewTaskList, TaskList } from 'types/taskList';
import { TaskData, TaskDataUpdate } from 'types/task';
import { idGenerator } from 'utils/id';

class TaskListId {
  private _id;
  
  private generateId () {
    return `${TaskListId.COMMON_PREFIX}${idGenerator()}`;
  }

  constructor () {
    this._id = this.generateId();
  }
  
  public static get COMMON_PREFIX() {
    return 'list-';
  }

  public static get INITIAL_ID() {
    return `${TaskListId.COMMON_PREFIX}initial`;
  }

  public toString() {
    return this._id;
  }
}

// // Seems like too much interfaces but in reality I don't know how to implement this properly
// 1. A class implements a data interface (TaskList), i.e., it guarantees the availability of
//    of a certain data fields
// 2. A class constructs itself from input data object, whoch comes from a storage (JSON.parsed(string))
// 3. We know _nothing_ about what's stored in that object, - it may be corrupted, have missing fields, etc.
// 4. So, by definition, this input really has the features of _any_ object.
// 5. Thus, it's reasonable to treat it as `any` type, - don't rely on any properties availability 
//    before we validated them.
// 
// interface TaskListData {
//   id?: string;
//   tasks?: TaskData[];
//   name: string;
//   color: string;
//   icon: string;
// }

export class TaskListModel implements TaskList {
  public id: string;
  public name: string;
  public color: PaletteColor;
  public icon: GlyphIcon;
  private _tasks: Map<string, TaskData>;
  private _tasksOrder: 'legacy' | 'by-date-added' = 'legacy';

  /**
   * Orders tasks by state (PINNED -> ACTIVE -> ARCHIVED), and then alphabetically
   */
  private orderTasks__Legacy(tasks: TaskData[]): TaskData[] {
    const tasksInOrder = [ ...tasks ].sort((t1: TaskData, t2: TaskData) => {
      if (t1.state === t2.state) {
        return t1.title.toLowerCase().charCodeAt(0) - t2.title.toLowerCase().charCodeAt(0);
      } else {
        return t1.state - t2.state;
      }
    });

    return tasksInOrder;
  }
  
  constructor(taskList: NewTaskList) {
    this.name = taskList.name;
    this.color = taskList.color;
    this.icon = taskList.icon;

    this.id = taskList.id || new TaskListId().toString();

    this._tasks = new Map();
    if (taskList.tasks) {
      for (const task of this.orderTasks(taskList.tasks)) {
        this._tasks.set(task.id, task);
      }
    }  
  }

  public orderTasks(tasks: TaskData[]): TaskData[] {
    if (this._tasksOrder === 'legacy') {
      return this.orderTasks__Legacy(tasks);
    } else {
      return tasks;
    }
  }

  public get tasks(): TaskData[] {
    return this.orderTasks([...this._tasks.values()]);
  }

  public getTaskById(taskId: string): TaskData {
    const t = this._tasks.get(taskId);
    if (!t) throw new Error(`Unknown task "${taskId}"`);

    return t;
  }

  public createTask(taskData: TaskData): void {
    this._tasks.set(taskData.id, taskData);
  }

  public updateTask(taskId: string, taskData: TaskDataUpdate): void {
    if (!this._tasks.get(taskId)) {
      console.error(`No task with id "${taskId}" exists in list "${this.id}"`);

      return;
    }

    this._tasks.set(
      taskId,
      {
        ...this._tasks.get(taskId),
        ...taskData,
      } as TaskData,
    )
  }

  public deleteTask(taskId: string): void {
    this._tasks.delete(taskId);
  }

  public toJson(): string {
    const result = JSON.stringify({
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      tasks: this.tasks,
    });

    return result;
  }

  public toObject(): TaskList {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      tasks: this.tasks,
    };
  }

  public static fromJson(value: string): TaskListModel {
    const parsed = JSON.parse(value);
    const result = new TaskListModel(parsed as TaskList);

    return result;
  }

  public static get INITIAL_TASKLIST_PARAMETERS(): TaskList {
    return {
      id: TaskListId.INITIAL_ID,
      name: 'To Do',
      color: palette.DimGray,
      icon: 'list-bullet',
      tasks: [],
    };
  }

  public static detectTaskListIdsFromStringArray(input: string[]): string[] {
    return input.filter(s => s.startsWith(TaskListId.COMMON_PREFIX));
  }
}

// Don't fully understand the mechanics but it's very neat:
// https://stackoverflow.com/questions/36382299/is-it-possible-to-define-a-type-string-literal-union-within-a-class-in-typescr
// https://stackoverflow.com/questions/29844959/enum-inside-class-typescript-definition-file/33301725#33301725
// 
// The type can't be defined inside a class, nor can it be returned from a class method. The `module` declaration fixes it:
// 
// export module ListId {
//   export type IndexType = `list-${string}`;
// }
