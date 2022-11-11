import localStorage from 'utils/localStorage';

import { TaskListRepository } from './TaskListRepository';

describe('TaskListRepository', () => {
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
  const repository = new TaskListRepository();

  beforeAll(async () => {
    await localStorage.setItem('list-0', JSON.stringify(listData_1));
    await localStorage.setItem('list-1', JSON.stringify(listData_2));
    await localStorage.setItem('unrelated-key', 'unrelated-data');
  });

  test('getAllListIds', async () => {
    const listIds = await repository.getAllListIds();
    expect(listIds).toEqual([listData_1.id, listData_2.id]);
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
});
