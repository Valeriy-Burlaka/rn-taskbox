import { TaskData, TaskStates } from 'types';
import { idGenerator } from 'utils/id';

export class TaskId {
  private _id;

  private generateId () {
    return `${TaskId.COMMON_PREFIX}${idGenerator()}`;
  }

  constructor () {
    this._id = this.generateId();
  }

  public static get COMMON_PREFIX() {
    return 'task-';
  }

  public static get INITIAL_ID() {
    return `${TaskId.COMMON_PREFIX}initial`;
  }

  public toString() {
    return this._id;
  }
}

export class Task {
  public id: TaskData['id'];
  public title: TaskData['title'];
  public state: TaskData['state'];
  public createdAt: TaskData['createdAt'];

  constructor () {
    this.id = new TaskId().toString();
    this.title = '';
    this.state = TaskStates.TASK_NEW;
    this.createdAt = Date.now();
  }

  toJson (): TaskData {
    return {
      id: this.id,
      title: this.title,
      state: this.state,
      createdAt: this.createdAt,
    };
  }
}
