/**
 * @jest-environment jsdom
 */

import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'react-native',
  configPath: './storybook-ondevice/index.js',
});
