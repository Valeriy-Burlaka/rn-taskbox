import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

import { Text, View } from 'components/Themed';
import { useAppData } from 'providers/DataProvider';
import { type RootTabScreenProps } from 'types/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

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
    </View>
  );
}
