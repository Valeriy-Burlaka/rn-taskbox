import AsyncStorage from '@react-native-async-storage/async-storage';

// https://react-native-async-storage.github.io/async-storage/docs/api/
export default {

  getAllKeys: async function(): Promise<string[] | null> {
    try {
      const result = await AsyncStorage.getAllKeys();

      return result.slice();
    } catch (e) {
      console.error('localStorage: Error in "getAllKeys":', e);
      return null;
    }
  },

  getItem: async function(key: string): Promise<string | null> {
    try {
      const result = await AsyncStorage.getItem(key);

      return result;
    } catch (e) {
      console.error(`localStorage: Failed to "getItem" "${key}":`, e);
      return null;
    }
  },

  getItems: async function(keys: string[]): Promise<readonly [string, string | null][] | null> {
    try {
      const items = await AsyncStorage.multiGet(keys);

      return items;
    } catch (e) {
      console.error('localStorage: Error in "getItems":', e);
      return null;
    }
  },

  setItem: async function(key: string, value: string): Promise<boolean> {
    try {
      // console.log(`localStorage: "setItem" "${key}":`, value);
      await AsyncStorage.setItem(key, value);

      return true;
    } catch (e) {
      console.error(`localStorage: Failed to "setItem" "${key}":`, e);
      return false;
    }
  },

  setAllItems: async function (items: [string, string][]) {
    try {
      await AsyncStorage.multiSet(items);

      return true;
    } catch (e) {
      console.error('localStorage: Error in "setAllItems":', e);
      return false;
    }
  },

  removeItem: async function(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`localStorage: Failed to "removeItem" "${key}":`, e);
    }
  },
}
