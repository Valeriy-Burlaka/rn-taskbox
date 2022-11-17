import localStorage from 'utils/localStorage';

import { TaskListRepository } from './TaskListRepository';

describe('TaskListRepository - empty storage', () => {
  const repository = new TaskListRepository();
  const initialListId = 'list-initial';

  afterAll(async () => {
    await localStorage.removeItem(initialListId);
  });

  test('getAllLists', async () => {
    const lists = await repository.getLists();
    expect(lists).toEqual([]);
  });

  test('getListTasks', async () => {
    const tasks = await repository.getListTasks('list-not-exists');
    expect(tasks).toEqual([]);
  });

  test('createNewList', async () => {
    const newListData = {
      id: initialListId,
      name: 'ToDo',
      color: 'yellow',
      icon: 'check-mark',
    };
    const newListId = await repository.createNewList(newListData);
    expect(newListId).toEqual(initialListId);

    const storedLists = await repository.getLists();
    expect(storedLists.length).toEqual(1);
    expect(storedLists[0].id).toEqual(newListId);
    expect(storedLists[0].name).toEqual(newListData.name);
    expect(storedLists[0].color).toEqual(newListData.color);
    expect(storedLists[0].icon).toEqual(newListData.icon);
    expect(storedLists[0].tasks).toEqual([]);
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

  test('getAllLists', async () => {
    const lists = await repository.getLists();
    expect(lists.length).toEqual(2);
    
    const list_1 = lists.filter(item => item.id === listData_1.id)[0];
    expect({
      id: list_1.id,
      name: list_1.name,
      color: list_1.color,
      icon: list_1.icon,
      tasks: list_1.tasks,
    })
    .toEqual(listData_1);

    const list_2 = lists.filter(item => item.id === listData_2.id)[0];
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
