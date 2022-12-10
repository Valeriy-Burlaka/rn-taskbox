import React from 'react';
import { StatusBar } from 'expo-status-bar';

import Navigation from 'navigation';

import { useAppData } from 'providers/DataProvider';
import { useInitializeApp } from 'hooks/useInitializeApp';
import { useColorScheme } from 'hooks/useColorScheme';

export function Main() {
  const colorScheme = useColorScheme();

  // const { taskLists } = useAppData();
  const { isAppReady } = useInitializeApp();

  // console.log(isAppReady);
  // console.log(taskLists);

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
