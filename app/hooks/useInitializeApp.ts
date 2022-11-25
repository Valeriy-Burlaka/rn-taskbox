import { useEffect, useState } from 'react';

import * as Font from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

import { TaskListRepository } from 'repository/TaskListRepository';
import { useAppData } from 'providers/DataProvider';

SplashScreen.preventAutoHideAsync();

export function useInitializeApp() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { setTaskLists } = useAppData();

  const isAppReady = fontsLoaded && dataLoaded;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          'NunitoSans-Bold': require('../assets/fonts/NunitoSans-Bold.ttf'),
          'NunitoSans-Italic': require('../assets/fonts/NunitoSans-Italic.ttf'),
          'NunitoSans': require('../assets/fonts/NunitoSans-Regular.ttf'),
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'percolate': require('../assets/icon/percolate.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const repository = new TaskListRepository();

        await repository.createInitialListIfNeeded();

        const taskLists = await repository.getLists();
        console.log('useInitializeApp: Task lists from AsyncStorage:', taskLists);

        setTaskLists(taskLists);

      } catch (e) {
        console.error('useInitializeApp: App initialization failed:', e);
      } finally {
        setDataLoaded(true);
      }
    }

    loadData();
  }, []);

  return { isAppReady };
}
