import { useState } from 'react';
import { Platform, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { rgba } from 'polished';
import styled from '@emotion/native';

const OuterContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  flex: 1;
  padding: 16px;
`;

const StyledTextInput = styled.TextInput`
  background-color: white;
  border-radius: 8px;
  height: 48px;
  margin-bottom: 48px;
  text-align: center;
`;

const PaletteContainer = styled.View`
  background-color: white;
  border-radius: 8px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px;
`;

const PaletteItem = styled.TouchableOpacity<{ backgroundColor: string; selected?: boolean }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 100px;
  height: 40px;
  width: 40px;
  margin: 8px;

  /* Not the view I'm looking for.
     Basically, I want to render a solid border around a selected palette item, not a blurry shadow.
     Will need to apply some hack, like rendering a wrapper View around.
  */
  shadow-color: ${({ selected }) => selected ? 'black' : undefined};
  shadow-offset: ${({ selected }) => selected ? '0px 0px' : undefined};
  shadow-opacity: ${({ selected }) => selected ? '1' : undefined};
  shadow-radius: ${({ selected }) => selected ? '3px' : undefined};
  /* https://github.com/styled-components/styled-components/issues/709 */
  /* Elevation is a workaround for Android. Shadow don't work on Android */
  /* elevation: 0; */

  /* Doesn't allow 4th parameter (spread radius) */
  /* box-shadow: 0px 0px 10px grey; */

  /* Doesn't work for me - borders are rendered inside (inward) the View */
  /* border-color: lightgrey;
  border-style: dotted;
  border-width: 5px; */
`;

// export component for Modal Header (replaces default)
// cross-button (close modal) -- <Icon name="list" /> -- "Save" button (saves new list; disabled when title is empty)
// !! Icon is the current one selected by Icon-picker

const palette = [
  // 1st row
  '#00FA9A', // MediumSpringGreen
  '#F08080', // LightCoral
  '#F4A460', // SandyBrown
  '#DAA520', // GoldenRod
  '#ADD8E6', // LightBlue
  '#87CEFA', // LightSkyBlue
  // 2nd row
  '#8A2BE2', // BlueViolet
  '#FFB6C1', // LightPink
  '#696969', // DimGray
  '#32CD32', // LimeGreen
  '#FF4500', // OrangeRed
  '#FFA500', // Orange
  // 3rd row
  '#FFD700', // Gold
  '#87CEEB', // SkyBlue
  '#4682B4', // SteelBlue
  '#800080', // Purple
  '#DC143C', // Crimson
  '#B8860B', // DarkGoldenRod
];

export function CreateNewListScreen() {
  const [activeColor, setActiveColor] = useState(palette[0]);
  const [listTitle, setListTitle] = useState('');

  return (
    <OuterContainer backgroundColor={activeColor}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <StyledTextInput
        selectionColor={activeColor}
        value={listTitle}
        onChangeText={setListTitle}
      />

      <PaletteContainer>
        {palette.map((color, index) => {
          return (
            <PaletteItem
              activeOpacity={1}
              backgroundColor={color}
              key={index}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveColor(color);
              }}
              selected={color === activeColor}
            />
          );
        })}
      </PaletteContainer>

      {/* Icon picker */}


      {/* <Text style={styles.title}>Create new list</Text> */}
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
    </OuterContainer>
  );
}
