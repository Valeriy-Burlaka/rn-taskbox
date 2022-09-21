import { registerRootComponent } from 'expo';

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Button } from 'components/Button';
import useCachedResources from 'hooks/useCachedResources';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function App() {
  const isLoadingComplete = useCachedResources();
  const [numClicked, setNumClicked] = useState(0);

  const incrementNumClicked = () => {
    setNumClicked(numClickedPrev => numClickedPrev + 1);
  };

  return isLoadingComplete ? (
    <View style={styles.container}>
      <Text>I was clicked {numClicked} times!</Text>
      <Button
        onPress={incrementNumClicked}
        text="Click me!"
      />
      <StatusBar style="auto" />
    </View>
  ) : null;
}

export default registerRootComponent(App);

// 1. On-device storybook setup remains mysteriously broken:
// * No stories discovered in the Navigator UI
// * Add-ons tab crashes imediately with " ERROR  TypeError: undefined is not an object (evaluating 'store.getSelection().storyId')" (AsyncStorage issue?..)
// ( https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage doesn't seem relevant)
// 
// 2. For automating the switch between the app and storybook UI see https://github.com/infinitered/ignite/blob/master/boilerplate/storybook/toggle-storybook.tsx
// 
// 3. Plain `start-storybook` command is working well. Youn can use the web storybook UI with "native" components.
// 
// import StorybookUIRoot from '../.ondevice/Storybook';
// export default registerRootComponent(StorybookUIRoot);
