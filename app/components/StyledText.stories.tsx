import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';

import { MonoText } from './StyledText';

const MonoTextMeta: ComponentMeta<typeof MonoText> = {
  title: 'MonoText',
  component: MonoText,
  argTypes: {

  }
};

export default MonoTextMeta;

type MonoTextStory = ComponentStory<typeof MonoText>;

export const Default: MonoTextStory = (args) => {
  return (
    <MonoText>
      /path/to/your/file
    </MonoText>
  )
};
