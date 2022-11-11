import AsyncStorage from '@react-native-async-storage/async-storage';

// https://react-native-async-storage.github.io/async-storage/docs/api/
export default {

  getAllKeys: async function(): Promise<readonly string[] | null> {
    try {
      const result = await AsyncStorage.getAllKeys();

      return result;
    } catch (e) {
      return null;
    }
  },

  getItem: async function(key: string): Promise<string | null> {
    try {
      const result = await AsyncStorage.getItem(key);

      return result;
    } catch (e) {
      // save/report an error
      return null;
    }
  },

  getItems: async function(keys: string[]): Promise<readonly [string, string | null][] | null> {
    try {
      const items = await AsyncStorage.multiGet(keys);

      return items;
    } catch (e) {
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
