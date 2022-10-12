import * as React from 'react';
import { View } from 'react-native';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import AddTaskButton from './AddTaskButton';

const actions = {
  onPress: action('AddTaskButton pressed'),
}

storiesOf('AddTaskButton', module)
  .addDecorator(story => <View style={{ flex: 1, padding: 60 }}>{story()}</View>)
  .add('default', () => <AddTaskButton {...actions} />)
