import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import styled from '@emotion/native';

import PercolateIcons from 'constants/Percolate';

import { textSizes } from 'theme/Typography';

const Checkbox = styled.View<{ color: string }>`
  border-color: ${({ color }) => color};
  border-style: solid;
  border-width: 2px;
  border-radius: 100px;
  background-color: transparent;
  height: ${textSizes.medium};
  width: ${textSizes.medium};
`;

export interface Props {
  checked: boolean;
  color: string;
  onPress: () => void;
}

export function TaskCheckmark({ checked, color, onPress }: Props) {
  return (
    <TouchableOpacity
      hitSlop={{
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      }}
      style={{
        paddingHorizontal: 12,
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      {!checked ? (
        <Checkbox color={color} />
      ) : (
        <PercolateIcons name="check" size={26} color={color} />
      )}
    </TouchableOpacity>
  );
}

