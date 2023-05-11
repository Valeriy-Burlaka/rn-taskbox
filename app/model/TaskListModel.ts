import type { NewTaskList, TaskList } from 'types/taskList';
import type { TaskData, TaskDataUpdate } from 'types/task';

import { TaskModel } from 'model/TaskModel';

import { idGenerator } from 'utils/id';

import { palette } from 'theme/Colors';

class TaskListId {
  private _id;

  private generateId() {
    return `${TaskListId.COMMON_PREFIX}${idGenerator()}`;
  }

  constructor() {
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

function isTaskList(obj: NewTaskList | TaskList): obj is TaskList {
  return (obj as TaskList).id !== undefined;
}

export class TaskListModel implements TaskList {
  public id: TaskList['id'];
  public name: TaskList['name'];
  public color: TaskList['color'];
  public icon: TaskList['icon'];
  public tasksOrder: TaskList['tasksOrder'] = 'by-date-created';

  private _tasks: Map<string, TaskData>;

  /**
   * Orders tasks by state (PINNED -> ACTIVE -> ARCHIVED), and then alphabetically
   */
  private orderTasks__Legacy(tasks: TaskData[]): TaskData[] {
    const tasksInOrder = [...tasks].sort((t1: TaskData, t2: TaskData) => {
      if (t1.state === t2.state) {
        return t1.title.toLowerCase().charCodeAt(0) - t2.title.toLowerCase().charCodeAt(0);
      } else {
        return t1.state - t2.state;
      }
    });

    return tasksInOrder;
  }

  /**
   * Orders tasks by state (PINNED -> ACTIVE -> ARCHIVED), and then by their creation date, with tasks created later
   * appearing at the end of the list.
   */
  private orderTasksByDateCreated(tasks: TaskData[]): TaskData[] {
    const tasksInOrder = [...tasks].sort((t1: TaskData, t2: TaskData) => {
      if (t1.state !== t2.state) {
        return t1.state - t2.state;
      } else {
        return t1.createdAt - t2.createdAt;
      }
    });

    return tasksInOrder;
  }

  private orderTasksByCustomOrder(tasks: TaskData[]): TaskData[] {
    const tasksInOrder = [...tasks].sort((t1: TaskData, t2: TaskData) => {
      // "task.order is probably `undefined`", and this is totally fine with me.
      // We should have '.order' property for all tasks in a 'custom'-ordered list, but if we ever have an
      // 'undefined' task order, these tasks will be NaN-sorted to the end of a list.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return t1.order - t2.order;
    });

    return tasksInOrder;
  }

  constructor(taskList: NewTaskList | TaskList) {
    this.name = taskList.name;
    this.color = taskList.color;
    this.icon = taskList.icon;

    this._tasks = new Map();
    // new task list
    if (!isTaskList(taskList)) {
      this.id = new TaskListId().toString();
      this.tasksOrder = 'by-date-created';
      this._tasks = new Map();
    } else {
      this.id = taskList.id;
      this.tasksOrder = taskList.tasksOrder;
      for (const task of taskList.tasks) {
        this._tasks.set(task.id, task);
      }
    }
  }

  public get tasks(): TaskList['tasks'] {
    return this.orderTasks([...this._tasks.values()]);
  }

  public orderTasks(tasks: TaskData[]): TaskData[] {
    if (this.tasksOrder === 'by-date-created') {
      return this.orderTasksByDateCreated(tasks);
    } else if (this.tasksOrder === 'manual') {
      return this.orderTasksByCustomOrder(tasks);
    } else if (this.tasksOrder === 'legacy') {
      return this.orderTasks__Legacy(tasks);
    } else {
      return tasks;
    }
  }

  public getTaskById(taskId: string): TaskData {
    const t = this._tasks.get(taskId);
    if (!t) throw new Error(`Unknown task "${taskId}"`);

    return t;
  }

  public createTask(): TaskData {
    const newTask = new TaskModel();
    this._tasks.set(newTask.id, newTask.toJson());

    return newTask.toJson();
  }

  public updateTask(taskId: string, taskData: TaskDataUpdate): void {
    if (!this._tasks.get(taskId)) {
      console.error(`No task with id "${taskId}" exists in list "${this.id}"`);

      return;
    }

    this._tasks.set(taskId, {
      ...this._tasks.get(taskId),
      ...taskData,
    } as TaskData);
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
      tasksOrder: this.tasksOrder,
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
      tasksOrder: 'by-date-created',
    };
  }

  public static detectTaskListIdsFromStringArray(input: string[]): string[] {
    return input.filter((s) => s.startsWith(TaskListId.COMMON_PREFIX));
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
