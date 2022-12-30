import 'utils/logbox';

import { HoldMenuProvider } from 'react-native-hold-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from 'providers/DataProvider';

import { Main } from 'components/Main';

function App() {
  // @ts-ignore
  console.log(`Using Hermes engine: ${!!global.HermesInternal}`);

  return (
    <DataProvider>
      <SafeAreaProvider>
        {/*
          FIXME: This is a hack.
          `HoldMenuProvider` from `react-native-hold-menu` library is here only because it accidentally makes
          another library, `react-native-context-menu-view`, to work properly. And "properly" means that on a
          long press gesture we trigger _only_ the context menu and don't also trigger the handler for a short
          press gesture, which does a navigation to a different screen.

          TODO: Create own, non-magic solution using `react-native-gesture-handler` library and its `GestureHandlerRootView` component.
        */}
        <HoldMenuProvider>
          <Main />
        </HoldMenuProvider>
      </SafeAreaProvider>
    </DataProvider>
  );
}

export default App;
