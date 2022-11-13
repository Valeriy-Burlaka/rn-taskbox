import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { useAppData } from 'providers/DataProvider';
import { useInitializeApp } from 'hooks/useInitializeApp';
import { useColorScheme } from 'hooks/useColorScheme';
import Navigation from 'navigation';

export function Main() {
  const colorScheme = useColorScheme();

  const { taskLists } = useAppData();
  const { isAppReady } = useInitializeApp();

  console.log(isAppReady);
  console.log(taskLists);

  if (!isAppReady) {
    return null;
  } else {
    return (
      <>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </>
    );
  }
}
