import { NewTaskList, TaskList } from 'types/taskList';
import { TaskData } from 'types/task';
import { idGenerator } from 'utils/id';


class TaskListId {
  private _id;
  
  private generateId () {
    return `list-${idGenerator()}`;
  }
  
  constructor () {
    this._id = this.generateId();
  }
  
  toString() {
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
  public color: string;
  public icon: string;
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

  // Why this one is static? :thinking-face:
  public static toJson(taskList: TaskListModel): string {
    const result = JSON.stringify({
      id: taskList.id,
      name: taskList.name,
      color: taskList.color,
      icon: taskList.icon,
      tasks: taskList.tasks,
    });

    return result;
  }

  public static fromJson(value: string): TaskListModel {
    const parsed = JSON.parse(value);
    const result = new TaskListModel(parsed as TaskList);

    return result;
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
