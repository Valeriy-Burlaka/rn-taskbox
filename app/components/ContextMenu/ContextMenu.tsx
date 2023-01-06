import { NativeSyntheticEvent } from 'react-native';
import {
  default as ContextMenuImplementation,
  ContextMenuProps as ContextMenuImplementationProps,
  ContextMenuOnPressNativeEvent,
} from 'react-native-context-menu-view';

import { transformInputActions } from './transformParameters';

import { type MenuAction } from './types';

export type Props = {
  actions: MenuAction[];
  children: React.ReactElement | React.ReactElement[];
} & Pick<ContextMenuImplementationProps, 'dropdownMenuMode' | 'onCancel' | 'preview' | 'title'>;

/**
 * This component merely wraps `ContextMenu` component from 'react-native-context-menu-view' library with a better API.
 * While 'react-native-context-menu-view.ContextMenu' implementation works great, I found its API not very friendly and clear.
 * The 2 main issue are:
 *   1. It's not possible to directly create a delimiter after a menu action. To create a delimiter, you have to
 *      create a sub-menu (sub-group) of actions but then sort of "reverse" this setting by specifying the `inlineChildren`,
 *      so that this sub-group renders normally, at the same menu hierarchy, and has a delimiter (sic!).
 *   2. You can't supply a menu action's `onPress` handler in the scope of this action's object, and there is even no notion
 *      of a per-action `onPress` handlers. Instead, all actions `onPress` handlers should be defined as a single handler on the
 *      `ContextMenu` component itself. This is bad for many reasons:
 *        * It's imperative - you have to manually specify when to invoke what basing on a "name" and "index" properties (that is,
 *          "name" and "index" of an action) supplied to the native event.
 *        * It's error prone, especially when you deal with sub-groups (see p.1) - the index is not unique, as it restarts from 0
 *          inside each group.
 *        * Finally, it's simply surprising, because it's not what you'd expect from `onPress` property on a standard component in
 *          React ecosystem. When something says "onPress", you'd expect it handles a press event on this component itself, and not
 *          a convoluted imperative handler for all children actions.
 *
 * The solution takes the props in a form that is easier to define and use, and to map them to the props expected by the implementation library.
 * This allows to provide `onPress` handlers declaratively, for each individual action, and to define delimiters with a simple property of an action.
 */
export function ContextMenu({ actions, children, ...props }: Props) {
  const [transformedActions, actionHandlers] = transformInputActions(actions);
  const imperativeOnPressHandler = (event: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    const {index, name} = event.nativeEvent;
    const handlerKey = `${index}-${name}`;
    if (actionHandlers[handlerKey]) {
      actionHandlers[handlerKey]();
    }
  }

  return (
    <ContextMenuImplementation
      actions={transformedActions}
      onPress={imperativeOnPressHandler}
      {...props}
    >
      {children}
    </ContextMenuImplementation>
  )
}
