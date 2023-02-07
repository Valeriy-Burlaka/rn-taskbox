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
