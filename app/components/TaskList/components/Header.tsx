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

const ListName = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

export type Props = Pick<TaskList, 'name' | 'color'> &
  {
    onPressBack: () => void;
    onPressDelete: () => void;
    onPressEdit: () => void;
  }
;

export function Header({ name, color, onPressBack, onPressDelete, onPressEdit }: Props) {
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
    </HeaderContainer>
  );
}
