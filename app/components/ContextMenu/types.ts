import { type ContextMenuAction as ContextMenuImplementationAction } from 'react-native-context-menu-view';

export interface MenuAction {
  name: ContextMenuImplementationAction['title'];
  icon?: ContextMenuImplementationAction['systemIcon'];
  hasDelimiter?: boolean;
  isDestructive?: ContextMenuImplementationAction['destructive'];
  isDisabled?: ContextMenuImplementationAction['disabled'];
  onPress?: () => void;
}
