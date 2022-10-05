import React, { useState, useEffect } from 'react';
import { Animated, Text, View, Easing, SafeAreaView } from 'react-native';

import { styles } from 'constants/globalStyles';

interface Props {
  children: React.ReactNode;
  style?: any;
}

const GlowView = (props: Props) => {
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence(
        [
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            /**
             * console.warn
                Animated: `useNativeDriver` is not supported because the native animated module is missing.
                Falling back to JS-based animation.
                To resolve this, add `RCTAnimation` module to this app, or remove `useNativeDriver`.
                Make sure to run `bundle exec pod install` first.
                Read more about autolinking: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md

                ^^^ Really nothing about this in Expo & RN docs :(
             */
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]
      )
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: glowAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const LoadingRow = () => (
  <SafeAreaView>
    <GlowView >
      <View style={styles.LoadingListItem}>
        <View style={styles.GlowCheckbox} />
        <Text style={styles.GlowText}>Loading</Text>
        <Text style={styles.GlowText}>task</Text>
        <Text style={styles.GlowText}>description</Text>
        <View style={styles.GlowCheckbox} />
      </View>
    </GlowView>
  </SafeAreaView>
);

export default LoadingRow;
