import { TouchableOpacity } from 'react-native';
import { rgba } from 'polished';
import styled from '@emotion/native';

import ContextMenu from 'react-native-context-menu-view';
import { HoldItem } from 'react-native-hold-menu';

import { TaskListModel } from 'model/TaskList';

import { FontelloIcon } from 'constants/Fontello';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

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
  { onPress: () => void, numTasks: number, width: number } &
  { contextMenuImplementation: 'hold-menu' | 'context-menu' | 'menu' }
;

export function ListCard({
  id,
  name,
  icon,
  color,
  onPress,
  numTasks,
  width,
  contextMenuImplementation,
}: Props) {
  if (contextMenuImplementation === 'hold-menu') {
    return (
      <HoldItem
        items={[
          {
            text: 'Edit List Info',
            icon: 'wrench',
            onPress: () => {
              alert(`Editing List Info #${id}`);
            },
            // withSeparator: true,
          },
          {
            text: 'Delete',
            icon: 'trash-empty',
            isDestructive: true,
            onPress: () => {
              alert(`Deleting List #${id}`)
            }
          }
        ]}
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
      </HoldItem>
    )
  } else if (contextMenuImplementation === 'context-menu') {
    return (
      <ContextMenu
        actions={[
          // Example of defining an item group (with a separator)
          // {
          //   inlineChildren: true,
          //   actions: [
          //     {
          //       title: 'Edit List Info',
          //       subtitletitle: 'WAT',
          //       systemIcon: 'pencil',
          //     },
          //   ],
          // },
          {
            title: 'Edit List Info',
            subtitletitle: 'WAT', // Don't know what this does
            systemIcon: 'pencil',
          },
          {
            title: 'Delete',
            subtitletitle: 'WAT?',
            systemIcon: 'trash',
            destructive: true,
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
    )
  } else {
    return null;
  }
}
