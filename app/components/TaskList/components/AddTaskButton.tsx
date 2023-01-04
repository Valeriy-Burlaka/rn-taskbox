import { Entypo } from '@expo/vector-icons';
import styled from '@emotion/native';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { TaskList } from 'types';

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 40px;
  right: 30px;

  flex-direction: row;
  align-items: center;
`;

const StyledButton = styled.TouchableOpacity<{ backgroundColor: string; size: number }>
`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ size }) => `${size / 2}px`};
  align-items: center;
  justify-content: center;
  margin-right: ${spacings.space50};
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

const AddTaskText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

export type Props = Pick<TaskList, 'color'> &
  {
    onPress: () => void
  }
;

export function AddTaskButton({ color, onPress }: Props) {
  return (
    <ButtonContainer>
      <StyledButton
        backgroundColor={color}
        onPress={onPress}
        size={32}
      >
        <Entypo name="plus" size={24} color="white" />
      </StyledButton>
      <AddTaskText color={color}>
        New Reminder
      </AddTaskText>
    </ButtonContainer>
  );
}
