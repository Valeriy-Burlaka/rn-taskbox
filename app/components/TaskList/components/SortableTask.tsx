import { View, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import styled from '@emotion/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  type SharedValue,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureEvent,
  PanGestureHandler,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useVector } from 'react-native-redash';

import { TaskData } from 'types/task';

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { FontelloIcon } from 'constants/Fontello';

const Container = styled(Animated.View)`
  align-items: center;
  background-color: white;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
  padding-left: ${spacings.space75};
  padding-right: ${spacings.space125};
`;

const StyledText = styled(TextInput)`
  background-color: transparent;
  flex: 1;
  font-family: 'NunitoSans';
  font-size: ${textSizes.regular};
  font-style: normal;
  line-height: 20px;
`;

export type TaskPosition = {
  id: string,
  order: SharedValue<number>,
  originalX: SharedValue<number>,
  originalY: SharedValue<number>,
  x: SharedValue<number>,
  y: SharedValue<number>,
  height: SharedValue<number>,
  width: SharedValue<number>,
  isReady: SharedValue<boolean>,
}

interface Props {
  title: TaskData['title'];
  positions?: TaskPosition[];
  index?: number;
}

export function SortableTask({ title, positions, index }: Props) {

  // Layout hasn't been calculated yet, - return non-animated version
  if (!(positions && index)) {
    return (
      <Container>
        <StyledText editable={false}>
          {title}
        </StyledText>
          <View>
            <FontelloIcon
              color='lightgrey'
              name='braille'
              size={spacings.unitless.space125}
            />
          </View>
      </Container>
    );
  }

  const position = positions[index];
  const originalX = useSharedValue(position.x.value);
  const originalY = useSharedValue(position.y.value);

  const isGestureActive = useSharedValue(false);
  const isAnimatedTransitionActiveX = useSharedValue(false);
  const isAnimatedTransitionActiveY = useSharedValue(false);

  const translation = useVector();
  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }

    isAnimatedTransitionActiveX.value = true;
    return withSpring(
      originalX.value,
      {
        damping: 30,
        stiffness: 200,
      },
      () => (isAnimatedTransitionActiveX.value = false),
    );
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }

    isAnimatedTransitionActiveY.value = true;
    return withSpring(
      originalY.value,
      {
        // mass: 5,
        damping: 30,
        stiffness: 200,
      },
      () => (isAnimatedTransitionActiveY.value = false),
    );
  });

  const onGestureEvent = useAnimatedGestureHandler<GestureEvent<PanGestureHandlerEventPayload>>({
    onStart: () => {
      translation.x.value = originalX.value;
      translation.y.value = originalY.value;
      isGestureActive.value = true;
    },
    onEnd: () => {
      isGestureActive.value = false;
    },
    onActive: ({ translationX, translationY }) => {
      translation.x.value = translationX;
      translation.y.value = translationY;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: isGestureActive.value || isAnimatedTransitionActiveX.value || isAnimatedTransitionActiveY.value ? '#EFF3F3' : 'white',
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      zIndex: isGestureActive.value || isAnimatedTransitionActiveX.value || isAnimatedTransitionActiveY.value ? 100 : 0,
    };
  });

  return (
    <Container
      style={animatedStyles}
    >
      <StyledText editable={false}>
        {title}
      </StyledText>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
      >
        <Animated.View>
          <FontelloIcon
            color='lightgrey'
            name='braille'
            size={spacings.unitless.space125}
          />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  )
}
