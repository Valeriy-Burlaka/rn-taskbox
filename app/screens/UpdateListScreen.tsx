import { type RootStackScreenProps } from 'types/navigation';
import { useAppData } from 'providers/DataProvider';

import { EditListForm } from 'components/EditListForm';


export function UpdateListScreen({ navigation, route }: RootStackScreenProps<'UpdateListScreen'>) {
  const { listId } = route.params;
  const { updateList, taskLists } = useAppData();

  const { name, icon, color } = taskLists[listId];

  return (
    <EditListForm
      initialValues={{ name, color, icon }}
      onPressClose={() => navigation.goBack()}
      onPressSave={({ name, color, icon }) => {
        return updateList(listId, { name, color, icon })
          .then(() => navigation.goBack());
      }}
    />
  );
}
