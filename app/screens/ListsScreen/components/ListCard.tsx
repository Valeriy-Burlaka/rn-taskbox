import { TouchableOpacity } from 'react-native';
import { rgba } from 'polished';
import styled from '@emotion/native';

import { TaskListModel } from 'model/TaskList';

import { FontelloIcon } from 'constants/Fontello';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { ContextMenu } from 'components/ContextMenu';

const ListCardContainer = styled(TouchableOpacity)<{
  backgroundColor: string;
  width: number,
  preview?: boolean
}>
`
  background-color: ${({ backgroundColor }) => backgroundColor ? rgba(backgroundColor, 0.2) : undefined};
  border: solid;
  border-color: black;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: ${spacings.space100};
  width: ${({width}) => `${width}px`};
  opacity: ${({ preview }) => preview ? '0.2' : '1'};
`;

const ListCardStatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ListCardTaskCounter = styled.Text`
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.large};
`;

const ListCardTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const ListCardTitle = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans;
  font-size: ${textSizes.medium};
`;

export type Props =
  Pick<TaskListModel, 'id' | 'name' | 'icon' | 'color'> &
  {
    onPress: () => void,
    onPressDeleteList: () => void;
    numTasks: number,
    width: number
  };

export function ListCard({
  id,
  name,
  icon,
  color,
  onPress,
  onPressDeleteList,
  numTasks,
  width,
}: Props) {
  return (
    <ContextMenu
      actions={[
        {
          name: 'Edit List Details',
          icon: 'pencil',
          hasDelimiter: true,
          onPress: () => alert('Edit details!'),
        },
        {
          name: 'Delete List',
          icon: 'trash',
          isDestructive: true,
          onPress: onPressDeleteList,
        },
      ]}
      preview={
        <ListCardContainer
          backgroundColor={color}
          onPress={onPress}
          width={width}
          preview={true}
        >
        <ListCardStatusRow>
          <FontelloIcon name={icon} color={color} size={28}/>
          <ListCardTaskCounter>
            {numTasks}
          </ListCardTaskCounter>
        </ListCardStatusRow>
        <ListCardTitleRow>
          <ListCardTitle color={color}>
            {name}
          </ListCardTitle>
        </ListCardTitleRow>
      </ListCardContainer>
      }
      previewBackgroundColor="transparent"
    >
      <ListCardContainer
        backgroundColor={color}
        onPress={onPress}
        width={width}
      >
        <ListCardStatusRow>
          <FontelloIcon name={icon} color={color} size={28}/>
          <ListCardTaskCounter>
            {numTasks}
          </ListCardTaskCounter>
        </ListCardStatusRow>
        <ListCardTitleRow>
          <ListCardTitle color={color}>
            {name}
          </ListCardTitle>
        </ListCardTitleRow>
      </ListCardContainer>
    </ContextMenu>
  );
}
