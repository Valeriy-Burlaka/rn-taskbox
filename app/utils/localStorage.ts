import AsyncStorage from '@react-native-async-storage/async-storage';

// https://react-native-async-storage.github.io/async-storage/docs/api/
export default {
  getItem: async function(key: string): Promise<string | null> {
    try {
      const item = await AsyncStorage.getItem(key);

      return item;
    } catch {
      // save/report an error
      return null;
    }
  },

  setItem: async function(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // save/report an error
    }
  },

  removeItem: async function(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // save/report an error
    }
  },
}
