import {
  addDecorator,
  addParameters,
  getStorybookUI,
  configure,
} from '@storybook/react-native';

import '@storybook/addon-ondevice-actions/register';
import '@storybook/addon-ondevice-backgrounds/register';
import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-notes/register';

import { decorators, parameters } from './preview';

if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

const getStories = () => {
  return [
    require('../app/components/Button/Button.stories.tsx'),
    require('../app/components/Task/Task.stories.tsx'),
    require('../app/components/TaskList/components/PureTaskList.stories.tsx'),
  ];
};

configure(getStories, module, false);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
