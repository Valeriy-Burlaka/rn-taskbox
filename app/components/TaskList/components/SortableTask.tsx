import { View, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import styled from '@emotion/native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  type SharedValue,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { TaskData } from 'types/task';

import { palette, spacings, textSizes } from 'theme';

import { FontelloIcon } from 'constants/Fontello';

const Container = styled(Animated.View)<{ height: number}>`
  align-items: center;
  background-color: white;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  height: ${({ height }) => height + 'px'};
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

function hapticImpact() {
  "worklet";

  runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
}

function clamp(value: number, min: number, max: number) {
  "worklet";

  return Math.max(min, Math.min(value, max));
}

function swapPositions(positions: {[key: string]: number}, fromPosition: number, toPosition: number) {
  "worklet";

  const newPositions = {...positions};
  for (const id in positions) {
    if (positions[id] === fromPosition) {
      newPositions[id] = toPosition;
    }
    if (positions[id] === toPosition) {
      newPositions[id] = fromPosition;
    }
  }

  return newPositions;
}

interface Props {
  height: number;
  id: string;
  itemsCount: number;
  positions: SharedValue<{[key: string]: number}>;
  scrollOffsetY: SharedValue<number>;
  title: TaskData['title'];
  topInsetHeight: number;
  getAutoScrollDirection: (panY: number) => 'down' | 'up' | null;
  startScrolling: (direction: 'down' | 'up') => void;
  stopScrolling: () => void;
}

export function SortableTask({
  height,
  id,
  itemsCount,
  positions,
  scrollOffsetY,
  title,
  topInsetHeight,
  getAutoScrollDirection,
  startScrolling,
  stopScrolling,
}: Props) {
  const positionY = useSharedValue(positions.value[id] * height);

  const isGestureActive = useSharedValue(false);
  const isReturningToOriginalY = useSharedValue(false);

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        positionY.value = withSpring(
          currentPosition * height,
          {
            damping: 30,
            stiffness: 200,
          },
        );
      }
    }
  );

  useAnimatedReaction(
    () => scrollOffsetY.value,
    (currentScrollOffset, previousScrollOffset) => {
      if (isGestureActive.value) {
        positionY.value += currentScrollOffset - (previousScrollOffset || 0);
      }
    }
  )

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      hapticImpact();
    })
    .onEnd(() => {
      hapticImpact();
      isGestureActive.value = false;
      runOnJS(stopScrolling)();

      isReturningToOriginalY.value = true;
      positionY.value = withSpring(
        positions.value[id] * height,
        {
          damping: 30,
          stiffness: 200,
        },
        () => (isReturningToOriginalY.value = false),
      );
    })
    .onUpdate(({ absoluteY }) => {
      // console.log(absoluteY);
      isGestureActive.value = true;

      const updatedY = absoluteY + scrollOffsetY.value;
      positionY.value = withTiming(updatedY - topInsetHeight - height, {
        duration: 16,
      });
      const newPosition = clamp(
        Math.floor((updatedY - topInsetHeight) / height),
        0,
        itemsCount - 1,
      );
      // console.log('New position: ', newPosition, '(was: ', thisElement.order.value, ')');
      if (newPosition !== positions.value[id]) {
        // console.log('Swapping element position from ', thisElement.order.value, 'to ', newPosition, '')
        hapticImpact();
        positions.value = swapPositions(positions.value, positions.value[id],  newPosition);
        // console.log('Updated element position:', thisElement.order.value, positions.value[index].order.value)
      }

      const autoScrollDirection = getAutoScrollDirection(absoluteY);
      if (autoScrollDirection) {
        runOnJS(startScrolling)(autoScrollDirection);
      } else {
        runOnJS(stopScrolling)();
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: (isGestureActive.value || isReturningToOriginalY.value) ? palette.AliceBlue : 'white',
      flex: 1,
      opacity: isGestureActive.value ? 0.8 : 1,
      position: 'absolute',
      top: positionY.value,
      left: 0,
      right: 0,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(isGestureActive.value ? 0.2 : 0),
      shadowRadius: 10,

      // TO-UNDERSTAND: I tried to re-factor (isGestureActive.value || isReturningToOriginalY.value) into a single,
      // `useDerivedValue` variable, but it doesn't work as expected. It seems that the derived value
      // doesn't keep up updating when a gesture is ended and an element transitions back to its original position.
      // This results in animated styles depending on the derived value not being updated.
      zIndex: (isGestureActive.value || isReturningToOriginalY.value) ? 1 : 0,
    };
  });

  return (
    <Container
      height={height}
      style={animatedStyles}
    >
      <StyledText editable={false}>
        {title}
      </StyledText>
      <GestureDetector gesture={panGesture}>
        <View>
          <FontelloIcon
            color='lightgrey'
            name='braille'
            size={spacings.unitless.space125}
          />
        </View>
      </GestureDetector>
    </Container>
  );
}
