import 'utils/logbox';

import { HoldMenuProvider } from 'react-native-hold-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontelloIcon } from 'constants/Fontello';
import { DataProvider } from 'providers/DataProvider';

import { Main } from 'components/Main';

function App() {
  // @ts-ignore
  console.log(`Using Hermes engine: ${!!global.HermesInternal}`);

  return (
    <DataProvider>
      <SafeAreaProvider>
        <HoldMenuProvider iconComponent={FontelloIcon}>
          <Main />
        </HoldMenuProvider>
      </SafeAreaProvider>
    </DataProvider>
  );
}

export default App;
