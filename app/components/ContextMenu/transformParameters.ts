import { type ContextMenuAction as ContextMenuImplementationAction } from 'react-native-context-menu-view';

import { type MenuAction } from './types';

// fixme: better name?
type GroupedAction = MenuAction & {
  actions?: MenuAction[]
  inlineChildren?: ContextMenuImplementationAction['inlineChildren'],
};

function createDelimitedGroups(actions: MenuAction[]): GroupedAction[] {
  if (actions.findIndex(item => item.hasDelimiter) >= 0) {
    const delimiterIndex = actions.findIndex(item => item.hasDelimiter);
    const delimitedActionsGroup = actions.slice(0, delimiterIndex + 1);

    return [
      {
        name: '', // todo: explain
        inlineChildren: true,
        actions: delimitedActionsGroup,
      },
      ...createDelimitedGroups(actions.slice(delimiterIndex + 1)),
    ];
  } else {
    return actions;
  }
};

function collectActionHandlers<T extends MenuAction & { actions?: MenuAction[]}>(
  actions: Array<T>,
): { [key: string]: () => void } {
  let result: { [key: string]: () => void } = {};

  actions.forEach((action) => {
    if (!action.actions) {
      actions.forEach((action, index) => {
        if (action.onPress) {
          const handlerKey = `${index}-${action.name}`;
          result[handlerKey] = action.onPress;
        }
      });
    } else {
      result = { ...result, ...collectActionHandlers(action.actions) };
    }
  });

  return result;
};

function mapActionProperties(actions: GroupedAction[]): ContextMenuImplementationAction[] {
  return actions.map((action) => {
    if (!action.actions) {
      return {
        title: action.name,
        systemIcon: action.icon,
        destructive: action.isDestructive,
        disabled: action.isDisabled,
        subtitletitle: '',  // todo: explain
      };
    } else {
      return {
        title: '',  // todo: explain
        subtitletitle: '',
        inlineChildren: action.inlineChildren,
        actions: mapActionProperties(action.actions),
      };
    }
  });
};

export function transformInputActions(actions: MenuAction[]): [ContextMenuImplementationAction[], { [key: string]: () => void }] {
  const grouped = createDelimitedGroups(actions);
  const handlersMap = collectActionHandlers(grouped);
  const result = [mapActionProperties(grouped), handlersMap];

  return result;  // fixme: types
}
