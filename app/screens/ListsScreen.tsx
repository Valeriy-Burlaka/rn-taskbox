import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

import { Text, View } from 'components/Themed';
import PercolateIcon from 'constants/Percolate';
import { useAppData } from 'providers/DataProvider';
import { type RootTabScreenProps } from 'types/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

const AddListButton = styled(TouchableOpacity)`
  background-color: mediumturquoise;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  position: absolute;
  top: 20px;
  right: 20px;
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
    <View style={styles.container}>
      {Object.values(taskLists).map((list) => {
        return (
          <>
            <AddListButton
              onPress={() => navigation.navigate('CreateNewListScreen')}
            >
              <PercolateIcon
                color={'white'}
                name="plus"
                size={16}
              />
            </AddListButton>
            <StyledList
              key={list.id}
              onPress={() => navigation.navigate('TasksScreen', { listId: list.id })}
            >
              <Text>
                {list.name}
              </Text>
            </StyledList>
          </>
        )
      })}
    </View>
  );
}
