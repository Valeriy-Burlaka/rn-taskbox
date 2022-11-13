import 'utils/logbox';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from 'providers/DataProvider';
import { Main } from 'components/Main';

function App() {
  return (
    <DataProvider>
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    </DataProvider>
  );
}

export default App;
