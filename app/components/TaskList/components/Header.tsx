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
  border: 1px solid red;
  margin-bottom: ${spacings.space200};
  padding: ${spacings.space100};
`;

const ListName = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

export type Props = Pick<TaskList, 'name' | 'color'> &
  {
    onPressBack: () => void;
  }
;

export function Header({ name, color, onPressBack }: Props) {
  return (
    <HeaderContainer>

      <TouchableOpacity
        onPress={onPressBack}
      >
        <Ionicons name="chevron-back" size={30} color={color} />
      </TouchableOpacity>

      <ListName
        color={color}
      >
        {name}
      </ListName>

      <ContextMenu
        actions={[
          {
            name: 'Blue',
            icon: 'pencil',
            isDisabled: true,
            onPress: () => alert('Blue'),
          },
          {
            name: 'Red',
            icon: 'trash',
            isDestructive: true,
            onPress: () => alert('Red'),
          },
          {
            name: 'Green',
            icon: 'eye',
            onPress: () => alert('Green'),
            hasDelimiter: true,
          },
          {
            name: 'Yellow',
            icon: 'sun',
            onPress: () => alert('Yellow'),
            hasDelimiter: true,
          },
          {
            name: 'Black',
            icon: 'moon',
            onPress: () => alert('Black'),
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
    </HeaderContainer>
  );
}
