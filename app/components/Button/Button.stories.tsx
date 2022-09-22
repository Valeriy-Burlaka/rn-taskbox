import React from 'react';
import { View } from 'react-native';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';

import { Button } from './Button';

const ButtonMeta: ComponentMeta<typeof Button> = {
  title: 'Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  decorators: [
    (Story) => (
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
        <Story />
      </View>
    ),
  ],
};

export default ButtonMeta;

type ButtonStory = ComponentStory<typeof Button>;

export const Default: ButtonStory = (args) => <Button {...args} />;
export const WithText = Default.bind({});
Default.args = {
  text: 'hello',
  onPress: () => console.log('Pressed the button')
};

export const Pink = Default.bind({});
Pink.args = {
  text: 'hey',
  backgroundColor: 'pink',
};
