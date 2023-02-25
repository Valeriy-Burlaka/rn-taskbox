import { View, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import styled from '@emotion/native';

import { TaskData } from 'types/task';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { FontelloIcon } from 'constants/Fontello';

const Container = styled(View)`
  align-items: center;
  background-color: white;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
  padding-horizontal: ${spacings.space75};
`;

const StyledText = styled(TextInput)`
  background-color: transparent;
  flex: 1;
  font-family: 'NunitoSans';
  font-size: ${textSizes.regular};
  font-style: normal;
  line-height: 20px;
`;

interface Props {
  title: TaskData['title'];
}

export function SortableTask({ title }: Props) {
  return (
    <Container>
      <StyledText editable={false}>
        {title}
      </StyledText>
      <FontelloIcon
        color='lightgrey'
        name='braille'
        size={spacings.unitless.space125}
      />
    </Container>
  )
}
