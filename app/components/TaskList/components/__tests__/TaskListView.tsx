import * as React from 'react';
import { create } from 'react-test-renderer';

import { Task } from 'components/Task';

import { TaskListView } from '../TaskListView';
import { withArchivedTasks, withPinnedTasks } from '../TaskListView.stories';

describe('PureTaskList', () => {
  it('renders pinned tasks at the start of the list', () => {
    const events = {
      onPinTask: jest.fn(), 
      onArchiveTask: jest.fn(),
    };
    const tree = create(
      <TaskListView loading={false} tasks={withPinnedTasks} {...events} />
    );
    const rootElement = tree.root;
    const listofTasks = rootElement.findAllByType(Task);
    expect(listofTasks[0].props.task.title).toBe('Task 6 (pinned)');
  });

  it('renders archived tasks at the end of the list', () => {
    const events = {
      onPinTask: jest.fn(),
      onArchiveTask: jest.fn(),
    };
    const tree = create(
      <TaskListView loading={false} tasks={withArchivedTasks} {...events} />
    );
    const rootElement = tree.root;
    const listofTasks = rootElement.findAllByType(Task);
    const lastTaskInThelist = listofTasks[listofTasks.length - 1];
    expect(lastTaskInThelist.props.task.title).toBe('Task 1 (archived)');
  });
});
