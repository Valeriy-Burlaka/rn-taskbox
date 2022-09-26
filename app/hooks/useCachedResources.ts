import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
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
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
