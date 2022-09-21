import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  backgroundColor?: string;
  onPress: () => void;
  text?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 80,
    maxWidth: 160,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 6,
  },
  text: {
    color: 'black',
    fontFamily: 'space-mono',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
});

export const Button = ({ backgroundColor = 'violet', text = 'click me', onPress, }: Props) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor,
      }}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
