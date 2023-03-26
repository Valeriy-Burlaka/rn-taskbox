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

import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

import { FontelloIcon } from 'constants/Fontello';

export const TASK_HEIGHT = 48;

const Container = styled(Animated.View)`
  align-items: center;
  background-color: white;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  height: ${() => TASK_HEIGHT + 'px'};
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

export function SortableTask({ title, positions, index }: Props) {

  // // Layout hasn't been calculated yet, - return non-animated version
  // if (positions === undefined || index === undefined) {
  //   console.log(`Task: ${title} -> no positions calculated yet`)
  //   return (
  //     <Container>
  //       <StyledText editable={false}>
  //         {title}
  //       </StyledText>
  //         <View>
  //           <FontelloIcon
  //             color='lightgrey'
  //             name='braille'
  //             size={spacings.unitless.space125}
  //           />
  //         </View>
  //     </Container>
  //   );
  // }

  // const thisElement = positions[index];
  // const originalX = useDerivedValue(() => (thisElement.x.value));
  // const originalY = useDerivedValue(() => (thisElement.y.value));

  const isGestureActive = useSharedValue(false);
  const isReturningToOriginalX = useSharedValue(false);
  const isReturningToOriginalY = useSharedValue(false);

  const translation = useVector();
  const translationContext = useVector();

  const panGesture = Gesture.Pan()
    // .onBegin((event) => {
    //   hapticImpact();
    //   // translationContext.x.value = originalX.value;
    //   // translationContext.y.value = originalY.value;
    //   // translation.x.value = originalX.value;
    //   // translation.y.value = originalY.value;
    // })
    // .onEnd(() => {
    //   hapticImpact();
    //   isGestureActive.value = false;
    //   translationContext.x.value = 0;
    //   translationContext.y.value = 0;
    // })
    // .onUpdate(({ translationX, translationY, x, y, absoluteX, absoluteY }) => {
    //   // console.log('>>>>>>>>>>>>>>>')
    //   // console.log('Translation, X/Y:', translationX, translationY);
    //   // console.log('Absolute, X/Y:', absoluteX, absoluteY);
    //   // console.log('X, Y:', x, y);
    //   }
    // );

  // const translateX = useDerivedValue(() => {
  //   if (isGestureActive.value) {
  //     return translation.x.value;
  //   }

  //   if (translation.x.value !== 0) {
  //     isReturningToOriginalX.value = true;

  //     return withSpring(
  //       originalX.value,
  //       {
  //         damping: 30,
  //         stiffness: 200,
  //       },
  //       () => (isReturningToOriginalX.value = false),
  //     );
  //   }

  //   return originalX.value;
  // });

  // const translateY = useDerivedValue(() => {
  //   if (isGestureActive.value) {
  //     return translation.y.value;
  //   }

  //   if (translation.y.value !== 0) {
  //     isReturningToOriginalY.value = true;

  //     return withSpring(
  //       originalY.value,
  //       {
  //         damping: 30,
  //         stiffness: 200,
  //       },
  //       () => (isReturningToOriginalY.value = false),
  //     );
  //   }

  //   return withSpring(originalY.value);
  // });

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
      // flex: 1,
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // right: 0,
      // opacity: (isGestureActive.value || isReturningToOriginalX.value || isReturningToOriginalY.value)
      // ? 0.5
      // : 1,
      // backgroundColor: (isGestureActive.value || isReturningToOriginalX.value || isReturningToOriginalY.value)
      //   ? '#EFF3F3'
      //   : 'white',
      // transform: [
      //   { translateX: translateX.value },
      //   { translateY: translateY.value },
      // ],
      // zIndex: isGestureActive.value || isReturningToOriginalX.value || isReturningToOriginalY.value ? 100 : 0,
    };
  });

  return (
    <Container
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
