import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export const actions = {
  onPress: action('onPress'),
};

storiesOf('Button', module)
  .addDecorator((story) => (
      <View
        style={{
          borderColor: 'coral',
          borderStyle: 'solid',
          borderWidth: 1,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {story()}
      </View>
    )
  )
  .add('default', () => <Button {...actions} />)
  .add('withText', () => <Button {...{ text: 'hello' }} {...actions} />)
  .add('withPinkBackground', () => <Button {...{ text: 'hey', backgroundColor: 'pink' }} {...actions} />);
