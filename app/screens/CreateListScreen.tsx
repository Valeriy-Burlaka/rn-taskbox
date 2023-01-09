import { type RootStackScreenProps } from 'types/navigation';
import { useAppData } from 'providers/DataProvider';

import { EditListForm } from 'components/EditListForm';


export function CreateListScreen({ navigation }: RootStackScreenProps<'CreateListScreen'>) {
  const { createList } = useAppData();

  return (
    <EditListForm
      onPressClose={() => navigation.goBack()}
      onPressSave={({ name, color, icon }) => {
        return createList({ name, color, icon })
          .then(() => navigation.goBack());
      }}
    />
  );
}
