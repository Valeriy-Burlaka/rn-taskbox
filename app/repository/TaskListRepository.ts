
import localStorage from 'utils/localStorage';

import { TaskListModel } from 'model/TaskList';
import { TaskData } from 'types/task';
import { NewTaskList, TaskList } from 'types/taskList';

export const STORAGE_KEYS = {
  initialListCreationMarker: 'initialListCreated',
};

export class TaskListRepository {

  private async getAllListIds(): Promise<string[]> {
    const allKeys = await localStorage.getAllKeys();

    return allKeys && TaskListModel.detectTaskListIdsFromStringArray(allKeys) || [];
  }

  public async getLists(): Promise<{ [key: string]: TaskListModel }> {
    const listIds = await this.getAllListIds();
    const lists = await localStorage.getItems(listIds);
    if (!lists) return {};

    const result = lists
      .filter(([_listId, listData]) => !!listData)
      // @ts-ignore - complains on "listData possibly `null`" despite the .filter() above
      .map(([listId, listData]) => [listId, TaskListModel.fromJson(listData)])

    return Object.fromEntries(result);
  }

  public async createInitialListIfNeeded(): Promise<void> {
    // Initial todo list is just a usual list and it can be deleted by the user.
    // We don't want to re-create this list if we already did this.
    const hasBeenCreatedBefore = await localStorage.getItem(STORAGE_KEYS.initialListCreationMarker);
    if (hasBeenCreatedBefore && JSON.parse(hasBeenCreatedBefore)) {
      return;
    }

    const listIds = await this.getAllListIds();
    if (!listIds.length) {
      const data = TaskListModel.INITIAL_TASKLIST_PARAMETERS;
      const result = await localStorage.setItem(
        data.id,
        JSON.stringify(data),
      );
      if (result) {
        // theoretically, can fail too
        await localStorage.setItem(STORAGE_KEYS.initialListCreationMarker, JSON.stringify(true));
      } else {
        // TODO: Leaving this alone for now because I don't actually believe in AsyncStorage failures.
        // Maybe I will want to re-try this operation in future.
        console.error('Failed to create the initial task list!');
      }
    }
  }
    
  public async createNewList(listData: NewTaskList): Promise<string> {
    const list = new TaskListModel(listData);
    await localStorage.setItem(list.id, TaskListModel.toJson(list));

    return list.id;
  }
  
  public async getListTasks(listId: string): Promise<TaskData[]> {
    const jsonResult = await localStorage.getItem(listId);
    // const jsonResult = await localStorage.getItem(`list-0`);
    if (jsonResult) {
      const taskList = TaskListModel.fromJson(jsonResult);
  
      return taskList.tasks;
    } else {
      return [];
    }
    // something is wrong if we requested a task list by ID but didn't get a result
  }
  
  public async setListTasks(listId: string, tasks: TaskData[]): Promise<void> {
  
  }
  // getList ?

  // updateListTassks ?

  // deleteList

  // deleteTaskFromList

  // addTaskToList
}

// Couple of reasons to enforce a limit:
// 
// 1. The app will likely become un-usable with hundreds of ToDO lists (not tasks, but tasks lists!)
// 2. The Async Storage limit is 6MB (https://react-native-async-storage.github.io/async-storage/docs/limits),
//    without dancing with platform feature flags. And 6MB is a very sane limit for string-like data.
//    Super ballpark estimate to never get into trouble:
//      * Let's say, a very dedicated users has 100 lists, 100 tasks in each list = 10,000 tasks
//      * Let's give 100 chars for each task's title and 150 chars for task metadata (e.g., task state, reminder settings, priority, etc.).
//        This is 10,000 * 250 ~= 2,500,000 bytes
//      * Add 100% for possible new features (e.g., detailed notes for each task), ~= 5,000,000 bytes ~= 4.9MB
//      * Leaves a safety buffer of ~20%, - not too much.
// 3. Allows pre-generating list IDs and use type-checking.
// 
// The only remainig question: is this a storage concern?
// Only the "business" layer knows what we will plan store (items, size), -- storage itself can't calculate this limit.
// export const MAX_LISTS_STORED = 100;

// export interface StorageModel {
//   [key: ListId.IndexType]: TaskList;
//   // defaultListId: string;  // for multi-list support
//   // viewMode: enum // for multi-list support: list | block
//   // isFirstAppLaunch: boolean // pre-create first "ToDo" list on first app launch
//   // firstOpenDate: Date  // analytics?
// }
// export type StorageKey = keyof StorageModel;
