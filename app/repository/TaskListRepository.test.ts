import localStorage from 'utils/localStorage';

import { TaskListRepository, STORAGE_KEYS } from './TaskListRepository';
import { TaskListModel } from 'model/TaskList';

describe('TaskListRepository - empty storage', () => {
  const repository = new TaskListRepository();
  const testListId = 'list-xyz';
  const initialListData = TaskListModel.INITIAL_TASKLIST_PARAMETERS;

  afterEach(async () => {
    await localStorage.removeItem(testListId);
    await localStorage.removeItem(initialListData.id);
  });

  test('getLists', async () => {
    const lists = await repository.getLists();
    expect(Object.values(lists)).toEqual([]);
  });

  test('getListTasks', async () => {
    const tasks = await repository.getListTasks('list-not-exists');
    expect(tasks).toEqual([]);
  });

  test('createNewList', async () => {
    const newListData = {
      id: testListId,
      name: 'Groceries',
      color: 'yellow',
      icon: 'shopping-cart',
    };
    const newListId = await repository.createNewList(newListData);
    expect(newListId).toEqual(testListId);

    const storedLists = Object.values(await repository.getLists());
    expect(storedLists.length).toEqual(1);
    expect(storedLists[0].id).toEqual(newListId);
    expect(storedLists[0].name).toEqual(newListData.name);
    expect(storedLists[0].color).toEqual(newListData.color);
    expect(storedLists[0].icon).toEqual(newListData.icon);
    expect(storedLists[0].tasks).toEqual([]);
  });

  test('createInitialListIfNeeded', async () => {
    await repository.createInitialListIfNeeded();

    let storedLists = Object.values(await repository.getLists());
    // Should have create the initial list in empty storage
    expect(storedLists.length).toEqual(1);
    expect(storedLists[0].id).toEqual(initialListData.id);
    expect(storedLists[0].name).toEqual(initialListData.name);
    expect(storedLists[0].color).toEqual(initialListData.color);
    expect(storedLists[0].icon).toEqual(initialListData.icon);
    expect(storedLists[0].tasks).toEqual([]);
    // Should also set the marker to prevent creating this list again, if the user deletes it manually.
    let markerValue = await localStorage.getItem(STORAGE_KEYS.initialListCreationMarker);
    expect(markerValue).toBeTruthy();
    expect(JSON.parse(markerValue)).toEqual(true);

    // Delete list but leave the marker. Then, ask the repository to "createInitialListIfNeeded" (not needed anymore)
    await localStorage.removeItem(initialListData.id);
    await repository.createInitialListIfNeeded();

    storedLists = Object.values(await repository.getLists());
    expect(storedLists).toEqual([]);
    // Marker should remain untouched
    markerValue = await localStorage.getItem(STORAGE_KEYS.initialListCreationMarker);
    expect(markerValue).toBeTruthy();
    expect(JSON.parse(markerValue)).toEqual(true);
  });
});

describe('TaskListRepository - storage with data', () => {
  const listData_1 = {
    id: 'list-0',
    name: 'Shopping List',
    icon: 'shopping-cart',
    color: 'pink',
    tasks: [
      { id: 'task-001', title: 'Cookies', state: 0 },
      { id: 'task-002', title: 'Milk', state: 1 },
    ],
  };
  const listData_2 = {
    id: 'list-1',
    name: 'Laundry',
    icon: 'checkmark',
    color: 'yellow',
    tasks: [
      { id: 'task-001', title: 'Socks', state: 1 },
    ],
  };
  const notList = {
    id: 'unrelated-key',
    data: 'unrelated-data',
  };
  const repository = new TaskListRepository();

  beforeAll(async () => {
    await localStorage.setItem(listData_1.id, JSON.stringify(listData_1));
    await localStorage.setItem(listData_2.id, JSON.stringify(listData_2));
    await localStorage.setItem(notList.id, notList.data);
  });

  afterAll(async () => {
    await localStorage.removeItem(listData_1.id);
    await localStorage.removeItem(listData_2.id);
    await localStorage.removeItem(notList.id);
  });

  test('getLists', async () => {
    const lists = await repository.getLists();
    expect(Object.values(lists).length).toEqual(2);

    const list_1 = lists[listData_1.id];
    expect(list_1).toBeTruthy();
    expect({
      id: list_1.id,
      name: list_1.name,
      color: list_1.color,
      icon: list_1.icon,
      tasks: list_1.tasks,
    })
    .toEqual(listData_1);

    const list_2 = lists[listData_2.id];
    expect(list_2).toBeTruthy();
    expect({
      id: list_2.id,
      name: list_2.name,
      color: list_2.color,
      icon: list_2.icon,
      tasks: list_2.tasks,
    })
    .toEqual(listData_2);
  });

  test('getListTasks', async () => {
    const tasks = await repository.getListTasks(listData_1.id);
    expect(tasks).toEqual(listData_1.tasks);
  });
});
