import * as React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

import { Text, View } from 'components/Themed';
import PercolateIcon from 'constants/Percolate';
import { useAppData } from 'providers/DataProvider';
import { type RootTabScreenProps } from 'types/navigation';

const OuterContainer = styled(View)`
  flex: 1;
  padding: 16px;
`;

const ListsHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const HeaderText = styled.Text`
  font-size: 16px;
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

const StyledList = styled(TouchableOpacity)`
  border: solid;
  border-color: black;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  height: 122px;
  width: 182px;
`;

export function ListsScreen({ navigation }: RootTabScreenProps<'ListsScreen'>) {
  const { taskLists } = useAppData();

  // console.log('ListsScreen: taskLists recevied from DataContext:', taskLists);

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

      {Object.values(taskLists).map((list) => {
        return (
          <StyledList
            key={list.id}
            onPress={() => navigation.navigate('TasksScreen', { listId: list.id })}
          >
            <Text>
              {list.name}
            </Text>
          </StyledList>
        )
      })}
    </OuterContainer>
  );
}
