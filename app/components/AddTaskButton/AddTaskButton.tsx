import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

import PercolateIcon from 'constants/Percolate';

interface Props {
  onPress: () => void;
  styles?: any;
}

const StyledButton = styled(TouchableOpacity)`
  background-color: violet;
  border-radius: 36px;
  align-items: center;
  justify-content: center;
  height: 72px;
  width: 72px;
`;

export default function AddTaskButton({ onPress, styles }: Props) {
  return (
    <StyledButton
      style={{ ...styles }}
      onPress={onPress}
    >
      <PercolateIcon name="plus" size={30} color={'black'} />
    </StyledButton>
  );
}

