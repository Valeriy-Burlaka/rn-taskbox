import { TouchableOpacity, View } from 'react-native';

import ContextMenu from 'react-native-context-menu-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import styled from '@emotion/native';

import { TaskList } from 'types';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

const HeaderContainer = styled.View<{}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
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

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <ListName
          color={color}
        >
          {name}
        </ListName>
      </View>

      {/* 3-dots menu */}
      <ContextMenu
        actions={[
          {
            title: 'Edit List Info',
            subtitletitle: 'WAT',
            systemIcon: 'pencil',
          },
          {
            title: 'Delete',
            subtitletitle: 'WAT?',
            systemIcon: 'trash',
            destructive: true,
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
