import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export function createDeleteAlert(listName: string, onConfirmDelete: () => void) {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning
  );
  Alert.alert(
    `Delete "${listName}"?`,
    'This will delete all items in this list. This action is not reversible.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onConfirmDelete,
        style: 'destructive',
      },
    ]
  )
};
