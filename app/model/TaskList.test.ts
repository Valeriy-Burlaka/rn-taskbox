import { TaskStates } from 'types/task';

import { TaskListModel } from './TaskList';

describe('TaskListModel', () => {
  
  test('creates new model', () => {
    const data = {
      name: 'Shopping List',
      icon: 'shopping-cart',
      color: 'pink',
    };
    const m = new TaskListModel(data);

    expect(typeof m.id).toBe('string');
    expect(m.id.startsWith('list-')).toBeTruthy();
    expect(m.name).toEqual(data.name);
    expect(m.icon).toEqual(data.icon);
    expect(m.color).toEqual(data.color);
    expect(m.tasks).toEqual([]);
  });

  test('restores model from JSON string', () => {
    const input = '{"name":"Shopping List","icon":"shopping-cart","color":"pink","id":"list-f3h5f25339684","tasks":[{"id":"task-abc123","title":"Buy zippo","state":0},{"id":"task-xyz321","title":"Buy T-Shirt with JS Evolution","state":1}]}';
    const m = TaskListModel.fromJson(input);

    expect(m instanceof TaskListModel).toBeTruthy();
    expect(m.id).toEqual('list-f3h5f25339684');
    expect(m.name).toEqual('Shopping List');
    expect(m.color).toEqual('pink');
    expect(m.icon).toEqual('shopping-cart');
    expect(m.tasks).toEqual([
      { id: 'task-abc123', title: 'Buy zippo', state: 0 },
      {
        id: 'task-xyz321',
        title: 'Buy T-Shirt with JS Evolution',
        state: 1
      }
    ]);
  });

  test('round trip', () => {
    const m = new TaskListModel({
      name: 'Shopping List',
      icon: 'shopping-cart',
      color: 'pink',
      id: 'list-f3h5f25339684',
      tasks: [
        { id: 'task-abc123', title: 'Buy zippo', state: TaskStates.TASK_PINNED },
        {
          id: 'task-xyz321',
          title: 'Buy T-Shirt with JS Evolution',
          state: TaskStates.TASK_INBOX
        }
      ],
    });
    const json = TaskListModel.toJson(m);
    const restored = TaskListModel.fromJson(json);

    expect(restored.id).toEqual(m.id);
    expect(restored.name).toEqual(m.name);
    expect(restored.color).toEqual(m.color);
    expect(restored.icon).toEqual(m.icon);
    expect(restored.tasks).toEqual(m.tasks);
    
    // won't work w/o consistent JSON formatting
    // expect(json).toEqual('{"name":"Shopping List","icon":"shopping-cart","color":"pink","id":"list-f3h5f25339684","tasks":[{"id":"task-abc123","title":"Buy zippo","state":0},{"id":"task-xyz321","title":"Buy T-Shirt with JS Evolution","state":1}]}');
  });
});
