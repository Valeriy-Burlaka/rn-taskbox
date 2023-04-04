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
  getScrollDirection: (panY: number) => 'down' | 'up' | null;
  startScrolling: (direction: 'down' | 'up') => void;
  stopScrolling: () => void;
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

export function SortableTask({
  height,
  index,
  positions,
  title,
  getScrollDirection,
  startScrolling,
  stopScrolling,
}: Props) {
  const thisElement = positions[index];
  const originalY = useDerivedValue(() => (thisElement.y.value));

  const isGestureActive = useSharedValue(false);
  const isReturningToOriginalY = useSharedValue(false);

  const translation = useVector();
  const translationContext = useVector();

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      hapticImpact();
      translationContext.y.value = originalY.value;
      translation.y.value = originalY.value;
    })
    .onEnd(() => {
      hapticImpact();
      isGestureActive.value = false;
      translationContext.x.value = 0;
      translationContext.y.value = 0;
      runOnJS(stopScrolling)();
    })
    .onUpdate(({ absoluteY, translationY }) => {
      // console.log(translationY, absoluteY);
      isGestureActive.value = true;
      translation.y.value = translationY + translationContext.y.value;

      const scrollDirection = getScrollDirection(absoluteY);
      if (scrollDirection) {
        runOnJS(startScrolling)(scrollDirection);
      }

      // // FIXME: Since I really operate only in one dimension (Y-axis), maybe check only 2 elements, top and bottom from this element?
      // for (let i = 0; i < positions.length; i++) {
      //   const comparedElement = positions[i];

      //   // console.log('COMPARING element ', thisElement.title, thisElement.order.value, 'to element: ', comparedElement.title, comparedElement.order.value, `(at index: ${i})`);
      //   // if (thisElement.id === comparedElement.id) {
      //   if (thisElement.order.value === comparedElement.order.value) {
      //     continue;
      //   }

      //   if (
      //     (
      //       translationY < 0 && between(
      //         translation.y.value,
      //         comparedElement.y.value + comparedElement.height.value * 0.25,
      //         comparedElement.y.value + comparedElement.height.value * 0.75,
      //       )
      //     ) || (
      //       translationY > 0 && between(
      //         translation.y.value + thisElement.height.value,
      //         comparedElement.y.value + comparedElement.height.value * 0.25,
      //         comparedElement.y.value + comparedElement.height.value * 0.75,
      //       )
      //     )
      //   ) {
      //     hapticImpact();
      //     console.log('Elements before swap, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
      //     console.log('Elements before swap, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);
      //     swapElements(positions, thisElement.order.value, comparedElement.order.value);
      //     console.log('Elements AFTER swap, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
      //     console.log('Elements AFTER swap, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);
      //     recalculateLayout(positions);
      //     console.log('Elements AFTER RE-CalculateLayout, this element (title / order[0] / y-position / y-cumulative-translation):', title, thisElement.order.value, thisElement.y.value, translation.y.value);
      //     console.log('Elements AFTER RE-CalculateLayout, compared element (title / order[0] / y-position / y-cumulative-translation):', title, comparedElement.order.value, comparedElement.y.value, comparedElement.y.value);

      //     break;
      //   }
      // }
    });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }

    if (translation.y.value !== 0) {
      isReturningToOriginalY.value = true;
      // console.log('Returning to original Y for element ', title, 'from: ', translation.y.value, 'to: ', originalY.value);

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
      backgroundColor: (isGestureActive.value || isReturningToOriginalY.value) ? palette.AliceBlue : 'white',
      flex: 1,
      opacity: isGestureActive.value ? 0.8 : 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      // shadowColor: 'black',
      // shadowOffset: {
      //   height: 0,
      //   width: 0,
      // },
      // shadowOpacity: withSpring(isGestureActive.value ? 0.2 : 0),
      // shadowRadius: 10,
      transform: [
        { translateY: translateY.value },
      ],
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
  )
}
