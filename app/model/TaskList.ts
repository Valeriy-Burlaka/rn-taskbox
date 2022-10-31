import { TaskList } from 'types/taskList';
import { TaskData, TaskId } from 'types/task';
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

export default class TaskListModel implements TaskList {
  public name: string;
  public color: string;
  public icon: string;
  private _id: TaskListId;
  private _tasks: Map<TaskId, TaskData>;
  
  constructor(name: string, color: string, icon: string) {
    this.name = name;
    this.color = color;
    this.icon = icon;

    this._id = new TaskListId();
    this._tasks = new Map();
  }

  public get id() {
    return this._id.toString()
  }

  public get tasks(): TaskData[] {
    // TODO: apply order
    return [...this._tasks.values()];
  }

  // TODO: serialize (dump)

  // TODO: deserialize (parse)
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
