import { useState } from 'react';
import { Platform } from 'react-native';
import styled from '@emotion/native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { rgba } from 'polished';

import { spacings } from 'constants/Spacings';
import { SCREEN_WIDTH } from 'utils/dimensions';

const OuterContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  flex: 1;
  padding: ${spacings.space100};
`;

const StyledTextInput = styled.TextInput`
  background-color: white;
  border-radius: ${spacings.space50};
  height: ${spacings.space300};
  margin-bottom: ${spacings.space300};
  text-align: center;
`;

const PaletteContainer = styled.View`
  background-color: white;
  border-radius: ${spacings.space50};
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${spacings.space50};
`;

const PaletteItem = styled.TouchableOpacity<{
  backgroundColor: string;
  size: string;
  selected?: boolean
}>`
    background-color: ${({ backgroundColor }) => backgroundColor};
    border-radius: 100px;
    height: ${({ size }) => size};
    width: ${({ size }) => size};
    margin: ${spacings.space50};

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

// https://www.w3schools.com/tags/ref_colornames.asp
export const palette = [
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

  const paletteItemsPerRow = 6;
  const outerPadding = Number(spacings.space100.replace('px', ''));
  console.log('Outr spacing:', outerPadding);
  const paletteItemSize = Math.floor(
    (
      SCREEN_WIDTH
        - (outerPadding * 2)
        - (outerPadding * (paletteItemsPerRow + 1))
    )
      / paletteItemsPerRow
  );
  console.log(`Calculated size of palette item for screen width=${SCREEN_WIDTH}px : ${paletteItemSize}px`);

  return (
    <OuterContainer backgroundColor={activeColor}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
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
              size={`${paletteItemSize}px`}
            />
          );
        })}
      </PaletteContainer>

      {/* Icon picker */}
    </OuterContainer>
  );
}
