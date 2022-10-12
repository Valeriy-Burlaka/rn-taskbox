import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  /**
   * """
   * WARN: Linking requires a build-time setting `scheme` in the project's
   * Expo config (app.config.js or app.json) for production apps.
   * If it's left blank, your app may crash.
   * The scheme does not apply to development in the Expo client but you should add it
   * as soon as you start working with Linking to avoid creating a broken build.
   * Learn more: https://docs.expo.dev/guides/linking/
   * """
   *
   * 1. Linking.createURL('/') needs a `{ scheme }` parameter.
   * 2. Source: `node_modules/expo-linking/src/Schemes.ts` :
   *
   * ```typescript
   * ...
   * if (__DEV__ && !options.isSilent) {
        // Assert a config warning if no scheme is setup yet. `isSilent` is used for warnings, but we'll ignore it for exceptions.
        console.warn(
          `Linking requires a build-time setting \`scheme\` in the project's Expo config (app.config.js or app.json) for production apps, if it's left blank, your app may crash. The scheme does not apply to development in the Expo client but you should add it as soon as you start working with Linking to avoid creating a broken build. Learn more: ${LINKING_GUIDE_URL}`
        );
      }
      ...
      ```

      Unforunately, looking at the source code, there is no way to pass the `isSilent` parameter.
  */
  "Linking requires a build-time setting `scheme` in the project's Expo config",
])
