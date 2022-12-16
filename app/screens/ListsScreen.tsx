import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { rgba } from 'polished';

import { Text, View } from 'components/Themed';
import { FontelloIcon } from 'constants/Fontello';
import PercolateIcon from 'constants/Percolate';
import { useAppData } from 'providers/DataProvider';
import { type RootTabScreenProps } from 'types/navigation';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';
import { SCREEN_WIDTH } from 'utils/dimensions';

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

const ListCard = styled(TouchableOpacity)<{ backgroundColor: string; width: number }>`
  background-color: ${({ backgroundColor }) => backgroundColor ? rgba(backgroundColor, 0.2) : undefined};
  border: solid;
  border-color: black;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: ${spacings.space100};
  width: ${({width}) => `${width}px`};
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

const getListWidthOnScreen = (numItemsPerRow = 2, gapBetween = 16, outerPaddings = 16 * 2) => {
  const listItemWidth = Math.floor((SCREEN_WIDTH - gapBetween - outerPaddings) / numItemsPerRow);

  return listItemWidth;
};

export function ListsScreen({ navigation }: RootTabScreenProps<'ListsScreen'>) {
  const { taskLists } = useAppData();

  // console.log('ListsScreen: taskLists recevied from DataContext:', taskLists);

  // console.log('Calculated list width:', getListWidthOnScreen());

  const listWidth = React.useMemo(() => getListWidthOnScreen(), [])

  return (
    <OuterContainer>
      <ListsHeaderContainer>
        <HeaderText>
          My lists
        </HeaderText>
        <AddListButton
          onPress={() => navigation.navigate('CreateNewListScreen')}
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
              backgroundColor={list.color}
              key={list.id}
              onPress={() => navigation.navigate('TasksScreen', { listId: list.id })}
              width={listWidth}
            >
              <ListCardStatusRow>
                <FontelloIcon name={list.icon} color={list.color} size={28}/>
                <ListCardTaskCounter>
                  {list.tasks.length}
                </ListCardTaskCounter>
              </ListCardStatusRow>
              <ListCardTitleRow>
                <ListCardTitle color={list.color}>
                  {list.name}
                </ListCardTitle>
              </ListCardTitleRow>
            </ListCard>
          )
        })}
      </ListsContainer>
    </OuterContainer>
  );
}
