/**
 * `RN-reanimated` `Animated.FlatList` component cannot be given refs (see https://github.com/software-mansion/react-native-reanimated/issues/2976)
 *
 * This solution is an updated copy of https://githuzbx.com/software-mansion/react-native-reanimated/issues/2976#issuecomment-1070702948 ,
 * which is in turn a copy of `Animated.FlatList` source code, with added `forwardRef` call.
 * I removed the custom `cellRenderer` function because it didn't seem to be correct and matching the underlying `VirtualizedList` interface.
 */

import React, { forwardRef } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import Animated, { ILayoutAnimationBuilder } from 'react-native-reanimated';

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface ReanimatedFlatlistProps<T> extends FlatListProps<T> {
  itemLayoutAnimation?: ILayoutAnimationBuilder;
}

/**
 * re-create Reanimated FlatList but correctly pass on forwardRef so can use useScrollToTop in react navigation
 *
 * Source: https://github.com/software-mansion/react-native-reanimated/blob/main/src/reanimated2/component/FlatList.tsx
 *
 * TODO: remove this and use Animated.FlatList directly when can use refs with it. Also type the generic T properly for FlatList and dont use `any`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedFlatList = forwardRef<FlatList, ReanimatedFlatlistProps<any>>(
  ({ ...restProps }, ref) => {
    return <ReanimatedFlatList ref={ref} {...restProps} />;
  },
);
