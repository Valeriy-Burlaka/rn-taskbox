import { idGenerator } from 'utils/id';

export enum TaskStates {
  TASK_PINNED = 0,
  TASK_INBOX = 1,
  TASK_NEW = 2,
  TASK_ARCHIVED = 3,
}

export class TaskId {
  private _id;

  private generateId () {
    return `task-${idGenerator()}`;
  }

  constructor () {
    this._id = this.generateId();
  }

  toString() {
    return this._id;
  }
}

export interface TaskData {
  id: string;
  title: string;
  state: TaskStates;
}
