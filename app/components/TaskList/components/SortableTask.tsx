import { View, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import styled from '@emotion/native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  useSharedValue,
  useDerivedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useVector } from 'react-native-redash';

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

export type TaskPosition = {
  id: string,
  order: SharedValue<number>,
  y: SharedValue<number>,
  height: SharedValue<number>,
}

interface Props {
  height: number;
  index: number;
  positions: TaskPosition[];
  title: TaskData['title'];
}

function hapticImpact() {
  "worklet";

  runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
}

function byOrder(a: TaskPosition, b: TaskPosition) {
  "worklet";

  return a.order.value > b.order.value ? 1 : -1;
}

function between(value: number, rangeStart: number, rangeEnd: number) {
  "worklet";

  return value >= rangeStart && value <= rangeEnd;
}

function swapElements(allElements: TaskPosition[], fromPosition: number, toPosition: number) {
  "worklet";

  const sortedCopy = allElements.slice().sort(byOrder);
  sortedCopy[toPosition] = allElements[fromPosition];
  sortedCopy[fromPosition] = allElements[toPosition];

  return sortedCopy.map((element, index) => {
    element.order.value = index;
  });
}

function recalculateLayout(allElements: TaskPosition[]) {
  "worklet";

  const elementHeight = allElements[0].height.value;
  allElements.sort(byOrder).forEach((elem) => {
    elem.y.value = elem.order.value * elementHeight;
  });
}

export function SortableTask({ height, index, positions, title }: Props) {

  const thisElement = positions[index];
  // const originalX = useDerivedValue(() => (thisElement.x.value));
  const originalY = useDerivedValue(() => (thisElement.y.value));

  const isGestureActive = useSharedValue(false);
  const isReturningToOriginalY = useSharedValue(false);
  const isMoving = useDerivedValue(() => isGestureActive.value || isReturningToOriginalY.value);

  const translation = useVector();
  const translationContext = useVector();

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      hapticImpact();
      // translationContext.x.value = originalX.value;
      translationContext.y.value = originalY.value;
      // translation.x.value = originalX.value;
      translation.y.value = originalY.value;
    })
    .onEnd(() => {
      hapticImpact();
      isGestureActive.value = false;
      translationContext.x.value = 0;
      translationContext.y.value = 0;
    })
    .onUpdate(({ absoluteY, translationY }) => {
      console.log(translationY);
      isGestureActive.value = true;
      // translation.x.value = translationX + translationContext.x.value;
      translation.y.value = translationY + translationContext.y.value;

      // FIXME: Since I really operate only in one dimension (Y-axis), maybe check only 2 elements, top and bottom from this element?
      for (let i = 0; i < positions.length; i++) {
        const comparedElement = positions[i];

        // console.log('COMPARING element ', thisElement.title, thisElement.order.value, 'to element: ', comparedElement.title, comparedElement.order.value, `(at index: ${i})`);
        // if (thisElement.id === comparedElement.id) {
        if (thisElement.order.value === comparedElement.order.value) {
          continue;
        }

        if (
          (
            translationY < 0 && between(
              translation.y.value,
              comparedElement.y.value + comparedElement.height.value * 0.25,
              comparedElement.y.value + comparedElement.height.value * 0.75,
            )
          ) || (
            translationY > 0 && between(
              translation.y.value + thisElement.height.value,
              comparedElement.y.value + comparedElement.height.value * 0.25,
              comparedElement.y.value + comparedElement.height.value * 0.75,
            )
          )
        ) {
          hapticImpact();
          console.log('Elements before swap, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
          console.log('Elements before swap, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);
          swapElements(positions, thisElement.order.value, comparedElement.order.value);
          console.log('Elements AFTER swap, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
          console.log('Elements AFTER swap, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);
          recalculateLayout(positions);
          console.log('Elements AFTER RE-CalculateLayout, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
          console.log('Elements AFTER RE-CalculateLayout, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);

          break;
        }
      }
    });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }

    if (translation.y.value !== 0) {
      isReturningToOriginalY.value = true;

      return withSpring(
        originalY.value,
        {
          damping: 30,
          stiffness: 200,
        },
        () => (isReturningToOriginalY.value = false),
      );
    }

    return withSpring(originalY.value);
  });

  // const originalYTracker = useDerivedValue(() => {
  //   console.log('Orignal Y changed for element:', thisElement.title, thisElement.y.value, originalY.value);
  //   return thisElement.y.value;
  // }, [thisElement.title, thisElement.y.value, originalY.value]);

  // const translationYTracker = useDerivedValue(() => {
  //   console.log('TRANSLATION Y changed for element:', thisElement.title, translation.y.value);

  //   return translation.y;
  // }, [translation.y.value]);

  // const orderTracker = useDerivedValue(() => {
  //   console.log('Element ORDER changed:', thisElement.title, thisElement.order.value);

  //   return thisElement.order;
  // }, [thisElement.order.value]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      opacity: isMoving.value ? 0.8 : 1,
      backgroundColor: isMoving.value ? palette.AliceBlue : 'white',
      transform: [
        { translateY: translateY.value },
      ],
      zIndex: isMoving.value ? 1 : 0,
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
  )
}
