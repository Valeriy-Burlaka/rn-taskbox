import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import styled from '@emotion/native';

import { SORT_TASKS_FEATURE_ENABLED } from 'config/featureFlags';

import { TaskList } from 'types';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { ContextMenu, type MenuAction } from 'components/ContextMenu';

const HeaderContainer = styled.View<{}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacings.space200};
  padding-top: ${spacings.space50};
  padding-left: ${spacings.space50};
  padding-right: ${spacings.space50};
`;

const HeaderText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

const ButtonContainer = styled.View`
  flex: 0.2;
  align-items: center;
  justify-content: flex-end;
`;

export type Props = Pick<TaskList, 'name' | 'color'> &
  {
    isEditingTasks: boolean;
    onPressDone: () => void;
    onPressBack: () => void;
    onPressMenuOptionDelete: () => void;
    onPressMenuOptionEdit: () => void;
    onPressMenuOptionSort: () => void;
  }
;

export function Header({
  name,
  color,
  isEditingTasks,
  onPressDone,
  onPressBack,
  onPressMenuOptionDelete,
  onPressMenuOptionEdit,
  onPressMenuOptionSort,
}: Props) {
  const menuActions = useMemo(() => {
    const result: MenuAction[] = [
      {
        name: 'Edit List Details',
        icon: 'pencil',
        onPress: onPressMenuOptionEdit,
      },
      {
        name: 'Delete List',
        icon: 'trash',
        isDestructive: true,
        onPress: onPressMenuOptionDelete,
      },
    ];
    if (SORT_TASKS_FEATURE_ENABLED) {
      result.splice(1, 0, {
        name: 'Sort Reminders',
        icon: 'arrow.up.arrow.down',
        hasDelimiter: true,
        onPress: onPressMenuOptionSort,
      });
    }

    return result;
  }, [SORT_TASKS_FEATURE_ENABLED]);

  return (
    <HeaderContainer>

      <TouchableOpacity
        onPress={onPressBack}
      >
        <Ionicons name="chevron-back" size={30} color={color} />
      </TouchableOpacity>

      <HeaderText
        color={color}
      >
        {name}
      </HeaderText>

      <ButtonContainer>
        {isEditingTasks ? (
          <TouchableOpacity
            hitSlop={{
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            }}
            onPress={onPressDone}
          >
            <HeaderText color={color}>
              Done
            </HeaderText>
          </TouchableOpacity>
        ) : (
          <ContextMenu
            actions={menuActions}
            dropdownMenuMode={true}
          >
            <Ionicons
              color={color}
              name="ios-ellipsis-horizontal-circle"
              size={26}
            />
          </ContextMenu>
        )}
      </ButtonContainer>
    </HeaderContainer>
  );
}
