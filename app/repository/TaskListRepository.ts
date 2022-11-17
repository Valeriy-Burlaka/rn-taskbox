
import localStorage from 'utils/localStorage';

import { TaskListModel } from 'model/TaskList';
import { TaskData } from 'types/task';
import { NewTaskList, TaskList } from 'types/taskList';

export class TaskListRepository {

  private async getAllListIds(): Promise<string[]> {
    const allKeys = await localStorage.getAllKeys();

    return allKeys && TaskListModel.detectTaskListIdsFromStringArray(allKeys) || [];
  }

  public async getLists(): Promise<TaskList[]> {
    const listIds = await this.getAllListIds();
    const lists = await localStorage.getItems(listIds);
    if (!lists) return [];

    const result = lists
      .filter(([_listId, listData]) => !!listData)
      // @ts-ignore - complains on "listData possibly `null`" despite the .filter() above
      .map(([_listId, listData]) => TaskListModel.fromJson(listData))

    return result;
  }
    
  async createNewList(listData: NewTaskList): Promise<string> {
    const list = new TaskListModel(listData);
    await localStorage.setItem(list.id, TaskListModel.toJson(list));

    return list.id;
  }
  
  // createInitialListIfNotExist
  // .getAllLists() -> .isEmpty? -> create & save the first list (App defines list parameters)
  // 

  // getList ?

  // updateListTassks ?

  // deleteList

  // deleteTaskFromList

  // addTaskToList
  
  async getListTasks(listId: string): Promise<TaskData[]> {
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
  
  async setListTasks(listId: string, tasks: TaskData[]): Promise<void> {
  
  }
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
