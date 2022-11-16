import 'utils/logbox';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from 'providers/DataProvider';
import { Main } from 'components/Main';

function App() {
  // @ts-ignore
  console.log(`Using Hermes engine: ${!!global.HermesInternal}`);

  return (
    <DataProvider>
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    </DataProvider>
  );
}

export default App;
