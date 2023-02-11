import { TouchableOpacity } from 'react-native';

import { ContextMenu } from 'components/ContextMenu';
import Ionicons from '@expo/vector-icons/Ionicons';
import styled from '@emotion/native';

import { TaskList } from 'types';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

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
    onPressDelete: () => void;
    onPressEdit: () => void;
  }
;

export function Header({
  name,
  color,
  isEditingTasks,
  onPressDone,
  onPressBack,
  onPressDelete,
  onPressEdit,
}: Props) {
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
            actions={[
              {
                name: 'Edit List Details',
                icon: 'pencil',
                hasDelimiter: true,
                onPress: onPressEdit,
              },
              {
                name: 'Delete List',
                icon: 'trash',
                isDestructive: true,
                onPress: onPressDelete,
              },
            ]}
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
