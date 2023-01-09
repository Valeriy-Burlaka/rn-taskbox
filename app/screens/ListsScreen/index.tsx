import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

import { View } from 'components/Themed';
import PercolateIcon from 'constants/Percolate';
import { useAppData } from 'providers/DataProvider';
import { type RootTabScreenProps } from 'types/navigation';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';
import { SCREEN_WIDTH } from 'utils/dimensions';
import { createDeleteAlert } from 'utils/deleteListAlert';

import { ListCard } from './components/ListCard';

const OuterContainer = styled(View)`
  flex: 1;
  padding: ${spacings.space100};
`;

const ListsHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${spacings.space100};
`;

const HeaderText = styled.Text`
  font-size: ${textSizes.regular};
  text-transform: uppercase;
`;

const AddListButton = styled(TouchableOpacity)`
  background-color: mediumturquoise;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
`;

const ListsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const getListWidthOnScreen = (numItemsPerRow = 2, gapBetween = 16, outerPaddings = 16 * 2) => {
  const listItemWidth = Math.floor((SCREEN_WIDTH - gapBetween - outerPaddings) / numItemsPerRow);

  return listItemWidth;
};

export function ListsScreen({ navigation }: RootTabScreenProps<'ListsScreen'>) {
  const { taskLists, deleteList } = useAppData();

  const listWidth = React.useMemo(() => getListWidthOnScreen(), []);

  const onPressDeleteList = (listId: string, listName: string) => {
    const onConfirmDelete = () => {
      deleteList(listId);
      navigation.navigate('ListsScreen');
    };

    createDeleteAlert(listName, onConfirmDelete);
  };

  return (
    <OuterContainer>
      <ListsHeaderContainer>
        <HeaderText>
          My lists
        </HeaderText>
        <AddListButton
          onPress={() => navigation.navigate('CreateListScreen')}
        >
          <PercolateIcon
            color={'white'}
            name="plus"
            size={16}
          />
        </AddListButton>
      </ListsHeaderContainer>

      <ListsContainer>
        {Object.values(taskLists).map((list) => {
          return (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              icon={list.icon}
              color={list.color}
              onPress={() => navigation.navigate('TasksScreen', { listId: list.id })}
              onPressDeleteList={() => onPressDeleteList(list.id, list.name)}
              numTasks={list.tasks.length}
              width={listWidth}
            />
          )
        })}
      </ListsContainer>
    </OuterContainer>
  );
}
